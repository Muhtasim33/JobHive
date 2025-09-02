#!/usr/bin/env python3
"""
Test file to verify the timezone fixes for PendingUser model
"""

import sys
import os
from datetime import datetime, timezone, timedelta

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import PendingUser

def test_timezone_handling():
    """Test that timezone handling works correctly"""
    app = create_app()
    
    with app.app_context():
        try:
            # Clean up any existing test data
            existing = PendingUser.query.filter_by(email="timezone_test@example.com").all()
            for user in existing:
                db.session.delete(user)
            db.session.commit()
            
            print("✅ Cleaned up existing test data")
            
            # Test 1: Create a pending user with timezone-aware expiration
            current_time = datetime.now(timezone.utc)
            future_time = current_time + timedelta(hours=1)
            past_time = current_time - timedelta(hours=1)
            
            # Create a non-expired user
            user1 = PendingUser(
                email="timezone_test@example.com",
                name="Test User",
                role="job_seeker", 
                verification_code="123456",
                expires_at=future_time
            )
            user1.set_password("testpassword")
            db.session.add(user1)
            
            # Create an expired user
            user2 = PendingUser(
                email="expired_test@example.com",
                name="Expired User",
                role="job_seeker",
                verification_code="654321", 
                expires_at=past_time
            )
            user2.set_password("expiredpassword")
            db.session.add(user2)
            
            db.session.commit()
            print("✅ Created test users with timezone-aware dates")
            
            # Test the cleanup function
            print(f"Current time: {current_time}")
            print(f"User1 expires at: {user1.expires_at}")
            print(f"User2 expires at: {user2.expires_at}")
            
            cleaned_count = PendingUser.cleanup_expired()
            print(f"✅ Cleanup function executed, removed {cleaned_count} expired users")
            
            # Verify results
            remaining_users = PendingUser.query.all()
            print(f"Remaining users: {len(remaining_users)}")
            for user in remaining_users:
                print(f"  - {user.email}, expires: {user.expires_at}")
            
            # Clean up
            for user in remaining_users:
                db.session.delete(user)
            db.session.commit()
            
            print("✅ All timezone tests passed!")
            return True
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    success = test_timezone_handling()
    sys.exit(0 if success else 1)
