from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import JSONB
import json


# ============================
# 🧍 Base User Model
# ============================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'jobseeker', 'employer', 'admin'
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6), nullable=True)

    reset_code = db.Column(db.String(6), nullable=True)
    reset_code_sent_at = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# ============================
# 📄 Resume Model
# ============================
class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("job_seekers.id"), nullable=False, unique=True)
    data = db.Column(db.Text, nullable=True)  # JSON stored as string
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)) # New field: tracks last modification

    def __repr__(self):
        return f'<Resume for owner_id {self.owner_id}>'

    def to_dict(self):
        """
        Converts the Resume object's 'data' field (JSON string) into a Python dictionary,
        ensuring it matches the frontend's ResumeData structure, including camelCase.
        It also provides default empty values for fields that might be missing in stored data.
        """
        # Define the default empty structure as expected by the frontend (camelCase)
        # This mirrors emptyResumeData from your frontend
        default_data_structure = {
            'firstName': '',
            'lastName': '',
            'email': '',
            'phone': '',
            'linkedIn': '',
            'summary': '',
            'education': [],
            'experience': [],
            'skills': [],
            'certifications': []
        }

        stored_data = {}
        if self.data:
            try:
                stored_data = json.loads(self.data)
            except json.JSONDecodeError:
                print(f"Warning: Could not decode JSON for resume ID {self.id}. Returning empty data.")
                stored_data = {} # Fallback to empty if data is corrupted

        # Merge stored data with the default structure.
        # This ensures all expected fields are present, even if not explicitly saved yet.
        # Stored data will override defaults where present.
        merged_data = {**default_data_structure, **stored_data}

        # The 'id' and 'ownerId' are part of the model itself, not the 'data' JSON
        result = {
            'id': self.id,
            'ownerId': self.owner_id,
            **merged_data, # Spread the merged resume data
            'lastUpdated': self.last_updated.isoformat() + 'Z' if self.last_updated else None
        }
        return result

    def from_dict(self, incoming_data: dict):
        """
        Updates the Resume object's 'data' field from an incoming dictionary.
        It merges the incoming data with existing data, then serializes back to JSON string.
        """
        current_stored_data = {}
        if self.data:
            try:
                current_stored_data = json.loads(self.data)
            except json.JSONDecodeError:
                print(f"Warning: Could not decode existing JSON for resume ID {self.id} during update. Starting with empty data.")
                current_stored_data = {}

        # Merge incoming data with current stored data.
        # Incoming data (from frontend PATCH) will override existing fields.
        # The frontend sends entire sections (e.g., 'education'), so a direct merge is fine.
        updated_data = {**current_stored_data, **incoming_data}

        # Convert back to JSON string for storage
        self.data = json.dumps(updated_data)





# ============================
# 🎓 JobSeeker Model
# ============================

class JobSeeker(db.Model):
    __tablename__ = "job_seekers"

    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)

    
    

    # New fields from registration form
    full_name = db.Column(db.String(255))
    title = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    country_code = db.Column(db.String(10))
    address = db.Column(db.String(255))
    profile_picture = db.Column(db.String(500))  # Store filename or URL

    # Store education as a list of entries
    education = db.Column(db.JSON)  # List of dicts: [{degree, institution, yearStart, yearEnd, description}]
    
    # Skills as an array of strings
    skills = db.Column(db.ARRAY(db.String))  # Or db.JSON if using SQLite
    cv_url = db.Column(db.String(1000))
    bio = db.Column(db.Text)

    # Relationship to user
    user = db.relationship("User", backref=db.backref("job_seeker", uselist=False))




# ============================
# 🏢 Employer Model
# ============================
class Employer(db.Model):
    __tablename__ = "employers"

    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)

    # Company Info
    company_name = db.Column(db.String(255), nullable=False)
    company_desc = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    banner_url = db.Column(db.String(255))

    # Founding Info
    founded_year = db.Column(db.Integer)
    num_employees = db.Column(db.String(100))  # e.g. "10-50", "51-200"
    funding = db.Column(db.String(100))
    industry = db.Column(db.String(100))

    # Social Media (stored as JSON list of {platform, url})
    social_links = db.Column(db.JSON)

    # Contact Info
    address = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    country_code = db.Column(db.String(10))
    email = db.Column(db.String(255))

    # Relationship to User
    user = db.relationship("User", backref=db.backref("employer", uselist=False))



# ============================
# 🛡️ Admin Model
# ============================
class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)

    user = db.relationship("User", backref=db.backref("admin", uselist=False))


# ============================
# 📄 Job Model
# ============================

class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey("employers.id"), nullable=False)  # ✅ This line
    title = db.Column(db.String(255), nullable=False)
    job_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    is_remote = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=False)
    salary = db.Column(db.String(100))
    deadline = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 
    skills = db.Column(db.Text)
    status = db.Column(db.String(20), default="active")  # values: active, expired, closed

    saved_jobs = db.relationship(
    "SavedJob",
    back_populates="job",
    lazy="dynamic",
    cascade="all, delete-orphan"
)


    employer = db.relationship("Employer", backref="jobs")
    applications = db.relationship(
    "Application",
    back_populates="job",
    lazy="dynamic",
    cascade="all, delete-orphan"
)



    def to_dict(self, include_applicant_count=False):
        return {
        "id": self.id,
        "title": self.title,
        "location": self.location,
        "job_type": self.job_type,
        "is_remote": self.is_remote,
        "description": self.description,
        "requirements": self.requirements,
        "salary": self.salary,
        "deadline": str(self.deadline) if self.deadline else None,
        "posted_by": self.employer_id,
        "company_name": self.employer.company_name if self.employer and self.employer.company_name else "N/A",
        "company_logo": self.employer.logo_url if self.employer and self.employer.logo_url else "",
        "skills": self.skills.split(",") if self.skills else [],
        "applicant_count": self.applications.count(),
        "status": self.status,
        "postedDate": self.created_at.strftime('%Y-%m-%d') if self.created_at else None,


    }




    def __repr__(self):
        return f"<Job {self.title}>"

# ============================
# 📄 Application Model
# ============================
class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    applicant_id = db.Column(db.Integer, db.ForeignKey("job_seekers.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    resume_snapshot = db.Column(JSONB, nullable=False)  # Storing resume as JSON
    applied_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    cv_url = db.Column(db.String(1000))

    job = db.relationship("Job", back_populates="applications")
    job_seeker = db.relationship("JobSeeker", backref="applications")

    def to_dict(self):
        return {
        "id": self.id,
        "job_id": self.job_id,
        "applicant_id": self.applicant_id,
        "applied_at": self.applied_at.isoformat(),
        "name": self.job_seeker.full_name if self.job_seeker else "Unknown",
        "email": self.job_seeker.user.email if self.job_seeker and self.job_seeker.user else "N/A",
        "resume_snapshot": {
            **self.resume_snapshot,  # Include all the current fields in resume_snapshot
            "cv_url": self.job_seeker.cv_url if self.job_seeker else None,  # Keep cv_url as it is, no need to prepend base URL
        },
    }




# ============================
# 🔔 Notification Model
# ============================


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    receiver_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    body = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    admin_id = db.Column(db.Integer, db.ForeignKey("admins.id"), nullable=True)
    read = db.Column(db.Boolean, default=False)

    receiver = db.relationship("User", backref="notifications")
    admin = db.relationship("Admin", backref="sent_notifications")

    

# ============================
# 💾 SavedJob Model
# ============================

class SavedJob(db.Model):
    __tablename__ = 'saved_jobs'
    id = db.Column(db.Integer, primary_key=True)
    seeker_id = db.Column(db.Integer, db.ForeignKey('job_seekers.id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))

    job = db.relationship("Job", back_populates="saved_jobs")

# ============================
# 📑 Report Model
# ============================

class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, resolved, investigating
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    job = db.relationship("Job", backref="reports")
    reporter = db.relationship("User", backref="reports")

    def to_dict(self):
        return {
        "id": self.id,
        "type": "Job",  # hardcoded for now unless you support user/content reports
        "title": self.job.title if self.job else "N/A",
        "status": self.status,
        "reportedDate": self.created_at.strftime("%Y-%m-%d"),  # or another readable format
        "jobId": self.job_id,
        "reason": self.reason 
    }


# ============================
# 📧 PendingUser Model (replaces in-memory pending_users)
# ============================
class PendingUser(db.Model):
    __tablename__ = "pending_users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'job_seeker', 'employer'
    verification_code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=False)  # Auto-cleanup expired entries

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    @classmethod
    def cleanup_expired(cls):
        """Remove expired pending users from database"""
        from datetime import datetime, timezone
        current_time = datetime.now(timezone.utc)
        
        # Get all pending users and check expiration manually to handle timezone issues
        all_pending = cls.query.all()
        expired_count = 0
        
        for pending_user in all_pending:
            expires_at = pending_user.expires_at
            # If expires_at is naive, make it timezone-aware (assume UTC)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            
            if expires_at < current_time:
                db.session.delete(pending_user)
                expired_count += 1
        
        db.session.commit()
        return expired_count

    def __repr__(self):
        return f'<PendingUser {self.email}>'



