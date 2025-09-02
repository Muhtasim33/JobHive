#!/usr/bin/env python3
"""
Debug timezone comparison issues
"""

import sys
import os
from datetime import datetime, timezone, timedelta

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import PendingUser

def debug_timezone_comparison():
    """Debug timezone comparison issues"""
    app = create_app()
    
    with app.app_context():
        try:
            current_time = datetime.now(timezone.utc)
            print(f"Current time (timezone-aware): {current_time}")
            print(f"Current time timezone: {current_time.tzinfo}")
            
            # Get all pending users
            all_users = PendingUser.query.all()
            print(f"\nFound {len(all_users)} pending users:")
            
            for user in all_users:
                expires_at = user.expires_at
                print(f"\nUser: {user.email}")
                print(f"  Expires at: {expires_at}")
                print(f"  Expires at type: {type(expires_at)}")
                print(f"  Expires at timezone: {expires_at.tzinfo}")
                
                # Try comparison with original value
                try:
                    is_expired_direct = expires_at < current_time
                    print(f"  Direct comparison (expires_at < current_time): ERROR - would fail")
                except TypeError as e:
                    print(f"  Direct comparison failed: {e}")
                
                # Try with timezone fix
                if expires_at.tzinfo is None:
                    expires_at_fixed = expires_at.replace(tzinfo=timezone.utc)
                    print(f"  Fixed expires_at: {expires_at_fixed}")
                    is_expired_fixed = expires_at_fixed < current_time
                    print(f"  Fixed comparison: {is_expired_fixed}")
                else:
                    print(f"  Already timezone-aware")
                    is_expired_fixed = expires_at < current_time
                    print(f"  Comparison: {is_expired_fixed}")
                    
        except Exception as e:
            print(f"❌ Debug failed: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    debug_timezone_comparison()
