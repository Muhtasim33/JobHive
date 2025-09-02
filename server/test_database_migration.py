#!/usr/bin/env python3
"""
Test script to verify the database migration from in-memory to database storage
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app import create_app, db
from app.models import User, PendingUser
from datetime import datetime, timedelta, timezone

def test_database_setup():
    """Test that the database tables are created correctly"""
    app = create_app()
    
    with app.app_context():
        try:
            # Test that all tables exist
            db.create_all()
            print("✅ Database tables created successfully")
            
            # Test PendingUser model
            test_email = "test@example.com"
            
            # Clean up any existing test data
            existing = PendingUser.query.filter_by(email=test_email).first()
            if existing:
                db.session.delete(existing)
                db.session.commit()
            
            # Create a test pending user
            pending_user = PendingUser(
                email=test_email,
                name="Test User",
                role="job_seeker",
                verification_code="123456",
                expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
            )
            pending_user.set_password("testpassword")
            
            db.session.add(pending_user)
            db.session.commit()
            print("✅ PendingUser created successfully")
            
            # Test retrieval
            retrieved = PendingUser.query.filter_by(email=test_email).first()
            assert retrieved is not None
            assert retrieved.name == "Test User"
            assert retrieved.role == "job_seeker"
            assert retrieved.verification_code == "123456"
            assert retrieved.check_password("testpassword")
            print("✅ PendingUser retrieval and password check successful")
            
            # Test cleanup method
            # Create an expired user
            expired_user = PendingUser(
                email="expired@example.com",
                name="Expired User",
                role="employer",
                verification_code="654321",
                expires_at=datetime.now(timezone.utc) - timedelta(hours=1)  # Already expired
            )
            expired_user.set_password("expiredpassword")
            db.session.add(expired_user)
            db.session.commit()
            
            # Test cleanup
            cleaned_count = PendingUser.cleanup_expired()
            assert cleaned_count == 1
            print("✅ Expired user cleanup successful")
            
            # Clean up test data
            remaining = PendingUser.query.filter_by(email=test_email).first()
            if remaining:
                db.session.delete(remaining)
                db.session.commit()
            
            print("✅ All tests passed! Database migration is successful.")
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            return False
    
    return True

if __name__ == "__main__":
    success = test_database_setup()
    sys.exit(0 if success else 1)
