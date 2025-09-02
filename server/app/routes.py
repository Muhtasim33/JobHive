import os
from turtle import title
import requests
from flask import Blueprint, request, jsonify
from .models import User
from . import db
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_cors import cross_origin
from app.models import JobSeeker, Resume, Employer, Application, Job, Notification, Report, PendingUser
import json
from flask import send_from_directory
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from datetime import date
from app.auth.decorators import admin_required
from app.auth.email_utils import send_verification_email
import random
from app.auth.email_utils import send_reset_email
from random import randint



 

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return {"message": "JobHive Backend is Running!"}

###########
# User Login Route
###########

# @main.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     email = data.get("email")
#     password = data.get("password")

#     user = User.query.filter_by(email=email).first()
#     if user is None or not user.check_password(password):
#         return jsonify({"message": "Invalid email or password"}), 401

#     access_token = create_access_token(identity=str(user.id))


#     return jsonify({
#         "message": "Login successful",
#         "access_token": access_token,
#         "user": {
#             "id": user.id,
#             "name": user.name,
#             "email": user.email,
#             "role": user.role
#         }
#     }), 200

@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    # Step 1: Validate credentials
    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    # ✅ Step 2: Check if email is verified
    if not user.is_verified:
        return jsonify({"message": "Please verify your email before logging in."}), 403

    # Step 3: Generate access token
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_verified": user.is_verified  # Optional, but useful for frontend
        }
    }), 200



###########
# User Registration Route
###########

# @main.route("/register", methods=["POST"])
# def register():
#     data = request.get_json()
#     name = data.get("name")
#     email = data.get("email")
#     password = data.get("password")
#     role = data.get("role")  # 'job_seeker' or 'employer'

#     if not all([name, email, password, role]):
#         return jsonify({"error": "All fields are required"}), 400

#     if role not in ["job_seeker", "employer"]:
#         return jsonify({"error": "Invalid role"}), 400

#     # Check if email already exists
#     if User.query.filter_by(email=email).first():
#         return jsonify({"error": "Email already registered"}), 400

#     user = User(name=name, email=email, role=role)
#     user.set_password(password)
#     db.session.add(user)
#     db.session.commit()

#     # Optional: Create JobSeeker or Employer entry
#     if role == "job_seeker":
#         from .models import JobSeeker
#         # jobseeker = JobSeeker(id=user.id, major="TBD", university="TBD")
#         jobseeker = JobSeeker(id=user.id)

#         db.session.add(jobseeker)
#     elif role == "employer":
#         from .models import Employer
#         employer = Employer(id=user.id, company_name="TBD", company_desc="TBD")
#         db.session.add(employer)

#     db.session.commit()

#     return jsonify({
#         "message": "User registered successfully",
#         "user": {
#             "id": user.id,
#             "name": user.name,
#             "email": user.email,
#             "role": user.role
#         }
#     }), 201

# @main.route("/register", methods=["POST"])
# def register():
#     data = request.get_json()
#     name = data.get("name")
#     email = data.get("email")
#     password = data.get("password")
#     role = data.get("role")  # 'job_seeker' or 'employer'

#     if not all([name, email, password, role]):
#         return jsonify({"error": "All fields are required"}), 400

#     if role not in ["job_seeker", "employer"]:
#         return jsonify({"error": "Invalid role"}), 400

#     existing_user = User.query.filter_by(email=email).first()

#     # ✅ Case: Email exists but not verified — allow frontend to resend code
#     if existing_user:
#         if not existing_user.is_verified:
#             return jsonify({
#                 "resend_verification": True,
#                 "message": "Email not verified. Please verify your email."
#             }), 200
#         else:
#             return jsonify({"error": "Email already registered"}), 400

#     # ✅ Create user
#     user = User(name=name, email=email, role=role)
#     user.set_password(password)
#     db.session.add(user)
#     db.session.commit()

#     # ✅ Create role-specific object
#     if role == "job_seeker":
#         from .models import JobSeeker
#         jobseeker = JobSeeker(id=user.id)
#         db.session.add(jobseeker)
#     elif role == "employer":
#         from .models import Employer
#         employer = Employer(id=user.id, company_name="TBD", company_desc="TBD")
#         db.session.add(employer)

#     db.session.commit()

#     return jsonify({
#         "message": "User registered successfully. Please verify your email.",
#         "user": {
#             "id": user.id,
#             "name": user.name,
#             "email": user.email,
#             "role": user.role
#         }
#     }), 201


# from flask import current_app
# from random import randint

# # Temporary storage (in-memory dict, use Redis in production)
# pending_users = {}

# @main.route("/send-verification-code", methods=["POST"])
# def send_verification_code():
#     data = request.get_json()
#     name = data.get("name")
#     email = data.get("email")
#     password = data.get("password")
#     role = data.get("role")

#     if not all([name, email, password, role]):
#         return jsonify({"error": "All fields are required"}), 400

#     if role not in ["job_seeker", "employer"]:
#         return jsonify({"error": "Invalid role"}), 400

#     if User.query.filter_by(email=email).first():
#         return jsonify({"error": "Email already registered"}), 400

#     # Generate code
#     code = str(randint(100000, 999999))

#     # Save in memory
#     pending_users[email] = {
#         "name": name,
#         "password": password,
#         "role": role,
#         "code": code,
#     }

#     # Simulate email sending (replace with real one)
#     current_app.logger.info(f"Verification code for {email}: {code}")

#     return jsonify({"message": "Verification code sent to your email."}), 200

# Temporary storage replaced with database table PendingUser
# pending_users = {}

@main.route("/send-verification-code", methods=["POST"])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def send_verification_code():
    from datetime import datetime, timedelta, timezone
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([name, email, password, role]):
        return jsonify({"error": "All fields are required"}), 400

    if role not in ["job_seeker", "employer"]:
        return jsonify({"error": "Invalid role"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    # ✅ Generate random 6-digit verification code
    code = str(randint(100000, 999999))

    # ✅ Check if there's already a pending user with this email
    existing_pending = PendingUser.query.filter_by(email=email).first()
    if existing_pending:
        # Update existing pending user
        existing_pending.name = name
        existing_pending.set_password(password)
        existing_pending.role = role
        existing_pending.verification_code = code
        existing_pending.created_at = datetime.now(timezone.utc)
        existing_pending.expires_at = datetime.now(timezone.utc) + timedelta(hours=24)  # 24 hour expiry
    else:
        # ✅ Create new pending user in database
        pending_user = PendingUser(
            email=email,
            name=name,
            role=role,
            verification_code=code,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=24)  # 24 hour expiry
        )
        pending_user.set_password(password)
        db.session.add(pending_user)

    db.session.commit()

    # ✅ Send real email using SMTP
    try:
        send_verification_email(email, code)
        return jsonify({"message": "Verification code sent to your email."}), 200
    except Exception as e:
        current_app.logger.error(f"❌ Failed to send email to {email}: {e}")
        return jsonify({"error": "Failed to send verification email."}), 500





###########
# Job Posting Route
###########
@main.route("/apply", methods=["POST"])
def apply():
    data = request.get_json()
    applicant_id = data.get("applicant_id")
    job_id = data.get("job_id")
    resume_snapshot = data.get("resume_snapshot")
    cv_url = data.get("cv_url")  # ✅ New field

    if not all([applicant_id, job_id, resume_snapshot]):
        return jsonify({"error": "applicant_id, job_id, and resume_snapshot are required"}), 400

    from .models import JobSeeker, Job, Application, Notification
    from app import db

    # Prevent duplicate applications
    existing_application = Application.query.filter_by(
        applicant_id=applicant_id,
        job_id=job_id
    ).first()
    if existing_application:
        return jsonify({"error": "You have already applied to this job"}), 400

    # Validate foreign keys
    applicant = JobSeeker.query.get(applicant_id)
    job = Job.query.get(job_id)
    if not applicant:
        return jsonify({"error": "Invalid applicant ID"}), 400
    if not job:
        return jsonify({"error": "Invalid job ID"}), 400

    # Create the application with cv_url
    application = Application(
        applicant_id=applicant_id,
        job_id=job_id,
        resume_snapshot=resume_snapshot,
        cv_url=cv_url  # ✅ Add this line
    )
    db.session.add(application)

    # Create notification
    notification = Notification(
        receiver_id=job.employer_id,
        body=f"{applicant.full_name} has applied for your job post: '{job.title}'"
    )
    db.session.add(notification)

    db.session.commit()

    return jsonify({
        "message": "Application submitted successfully",
        "application_id": application.id,
        "applied_at": application.applied_at
    }), 201


# ###########
# Get notifications Route
# ###########

@main.route("/notifications/<int:user_id>", methods=["GET"])
def get_notifications(user_id):
    from .models import Notification
    from app import db

    notifications = Notification.query.filter_by(receiver_id=user_id).order_by(Notification.created_at.desc()).all()

    return jsonify({
        "notifications": [ 
            {
                "id": n.id,
                "body": n.body,
                "created_at": n.created_at.isoformat(),
                "read": n.read 
            } for n in notifications
        ]
    })



############
# Get applications for a job Route
#############

@main.route("/jobseeker/<int:jobseeker_id>/applications", methods=["GET"])
def get_applications(jobseeker_id):
    from .models import Application

    apps = Application.query.filter_by(applicant_id=jobseeker_id).all()
    return jsonify({
        "applications": [ 
            {
                "job_title": app.job.title,
                "company": app.job.employer.name,
                "applied_at": app.applied_at,
                "resume": app.resume_snapshot
            } for app in apps
        ]
    })



#############
# Get applications by user Route
#############


@main.route("/applications/user", methods=["GET"])
def get_applications_by_user():
    applicant_id = request.args.get("applicant_id")

    if not applicant_id:
        return jsonify({"error": "Missing applicant_id"}), 400

    from .models import Application, Job, Resume

    applications = Application.query.filter_by(applicant_id=applicant_id).all()
    result = []

    for app in applications:
        job = Job.query.get(app.job_id)
        resume = Resume.query.get(app.resume_id)

        result.append({
            "application_id": app.id,
            "applied_at": app.applied_at,
            "job": {
                "id": job.id,
                "title": job.title,
                "description": job.description
            },
            "resume_id": resume.id if resume else None
        })

    return jsonify(result)








############
# Admin Dashboard Stats Route
#############


# ###########
# Resume Upload and Check Route
# ###########

load_dotenv()
AFFINDA_API_KEY = os.getenv("AFFINDA_API_KEY")


@main.route("/upload-resume", methods=["POST"])
@jwt_required()
def upload_resume():
    from app import db
    from .models import JobSeeker
    from flask import request
    import os

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    upload_path = os.path.join("uploads", filename)
    file.save(upload_path)

    # Generate full URL for the file
    base_url = request.host_url.rstrip("/")  # e.g., "http://localhost:8000"
    full_url = f"{base_url}/uploads/{filename}"

    # Call Affinda API
    with open(upload_path, 'rb') as f:
        headers = { "Authorization": f"Bearer {AFFINDA_API_KEY}" }
        files = { "file": (filename, f, file.content_type) }
        response = requests.post("https://api.affinda.com/v2/resumes", headers=headers, files=files)

    data = response.json()
    if response.status_code != 200:
        return jsonify({"error": "Resume parsing failed", "affinda_response": data}), response.status_code

    parsed = data.get("data", {})
    name = parsed.get("name")
    profession = parsed.get("profession")
    education = parsed.get("education", [])
    skills = parsed.get("skills", [])
    experience = parsed.get("totalYearsExperience")

    # Soft validation (ignore confidence)
    if not name or not profession or not education:
        return jsonify({
            "error": "Uploaded file does not appear to be a valid resume.",
            "found_name": name,
            "found_profession": profession,
            "education": education,
            "skills": skills
        }), 400

    # Save to user profile
    user_id = get_jwt_identity()
    job_seeker = JobSeeker.query.get(user_id)
    if job_seeker:
        job_seeker.cv_url = full_url  # Save the full URL
        db.session.commit()

    return jsonify({
        "message": "Resume parsed successfully ✅",
        "cv_url": full_url,  # Return the full URL
        "name": name,
        "profession": profession,
        "skills": skills,
        "education": education,
        "experience": experience
    }), 200



#############
# Save Resume Route
##############

@main.route("/resume/save", methods=["POST"])
@jwt_required()
def save_resume():
    job_seeker_id = get_jwt_identity()
    data = request.get_json()

    # Save to Resume table
    resume = Resume.query.filter_by(owner_id=job_seeker_id).first()
    if not resume:
        resume = Resume(owner_id=job_seeker_id)

    resume.data = json.dumps(data)
    db.session.add(resume)

    # Optionally update JobSeeker.cv_url if provided
    cv_url = data.get("cv_url")
    if cv_url:
        job_seeker = JobSeeker.query.get(job_seeker_id)
        if job_seeker:
            job_seeker.cv_url = cv_url
            db.session.add(job_seeker)

    db.session.commit()

    return jsonify({"message": "Resume saved successfully."}), 200



############
# Load Resume Route
############

@main.route("/resume/load", methods=["GET"])
@jwt_required()
def load_resume():
    job_seeker_id = get_jwt_identity()

    resume = Resume.query.filter_by(owner_id=job_seeker_id).first()
    if resume:
        return jsonify({"resume": json.loads(resume.data)}), 200
    else:
        return jsonify({"resume": None}), 200


############
# Get all jobs Route
#############

@main.route("/jobs", methods=["GET"])
def get_all_jobs():
    from .models import Job, Employer
    from datetime import date
    from app import db

    jobs = Job.query.all()
    job_list = []
    updated = False

    for job in jobs:
        if job.deadline and job.deadline < date.today() and job.status != "expired":
            job.status = "expired"
            updated = True

        employer = job.employer

        job_list.append({
            "id": job.id,
            "title": job.title,
            "location": job.location,
            "job_type": job.job_type,
            "is_remote": job.is_remote,
            "description": job.description,
            "requirements": job.requirements,
            "salary": job.salary,
            "deadline": job.deadline.strftime("%Y-%m-%d") if job.deadline else None,
            "company_name": employer.company_name if employer else "Unknown",
            "company_logo": employer.logo_url if employer else None,
            "posted_date": job.created_at.strftime("%Y-%m-%d") if job.created_at else None,
            "skills": job.skills.split(",") if job.skills else [],
            "status": job.status
        })

    if updated:
        db.session.commit()

    return jsonify(job_list), 200






###############
# Create job Route
###############

@main.route("/jobs", methods=["POST"])
def create_job():
    data = request.get_json()
    print(request.get_json())

    
    # Validate and create the job...
    # Example:
    title = data.get("title")
    job_type = data.get("type")
    location = data.get("location")
    is_remote = data.get("is_remote", False)
    description = data.get("description")
    requirements = data.get("requirements")
    salary = data.get("salary")
    deadline = data.get("deadline")
    employer_id = data.get("employer_id")  # You can get from token/user context in real flow

    if not all([title, job_type, location, description, requirements]):
        return jsonify({"error": "Missing required fields"}), 400

    from .models import Job
    new_job = Job(
        title=title,
        job_type=job_type,
        location=location,
        is_remote=is_remote,
        description=description,
        requirements=requirements,
        salary=salary,
        deadline=deadline,
        employer_id=employer_id
    )

    db.session.add(new_job)
    db.session.commit()

    return jsonify({"message": "Job created successfully", "job_id": new_job.id}), 201


##############
# Get jobs by employer Route
###############

@main.route("/employer/<int:employer_id>/jobs", methods=["GET"])
def get_employer_jobs(employer_id):
    from .models import Job
    from datetime import date
    from app import db

    jobs = Job.query.filter_by(employer_id=employer_id).all()
    updated = False

    for job in jobs:
        if job.deadline and job.deadline < date.today() and job.status != "expired":
            job.status = "expired"
            updated = True

    if updated:
        db.session.commit()

    return jsonify({
        "jobs": [job.to_dict(include_applicant_count=True) for job in jobs]
    })





@main.route("/resume", methods=["PATCH"])
@jwt_required()
def update_resume():
    user_id = get_jwt_identity()
    from .models import Resume, JobSeeker
    job_seeker = JobSeeker.query.get(user_id)
    if not job_seeker:
        return jsonify({"error": "Job seeker not found"}), 404

    resume = Resume.query.filter_by(owner_id=job_seeker.id).first()
    if not resume:
        resume = Resume(owner_id=job_seeker.id)

    incoming_data = request.get_json()
    if not incoming_data:
        return jsonify({"error": "No resume data provided"}), 400

    resume.from_dict(incoming_data)

    db.session.add(resume)
    db.session.commit()

    return jsonify({"message": "Resume updated successfully"}), 200




@main.route("/resume", methods=["GET"])
@jwt_required()
def get_resume():
    user_id = get_jwt_identity()

    from .models import JobSeeker, Resume

    job_seeker = JobSeeker.query.get(user_id)
    if not job_seeker:
        return jsonify({"error": "Job seeker not found"}), 404

    resume = Resume.query.filter_by(owner_id=job_seeker.id).first()

    # ✅ Auto-create empty resume if not found
    if not resume:
        resume = Resume(owner_id=job_seeker.id, data=json.dumps({}))
        db.session.add(resume)
        db.session.commit()

    return jsonify(resume.to_dict()), 200






@main.route("/job-seeker/<int:seeker_id>/applied-jobs", methods=["GET"])
def get_applied_jobs(seeker_id):
    from .models import Application, Job
    applications = Application.query.filter_by(applicant_id=seeker_id).all()

    seen_job_ids = set()
    jobs = []

    for application in applications:
        if application.job_id not in seen_job_ids:
            job = Job.query.get(application.job_id)
            if job:
                jobs.append(job.to_dict())
                seen_job_ids.add(application.job_id)

    return jsonify(jobs), 200


@main.route("/save", methods=["POST"])
def save_job():
    data = request.get_json()
    job_id = data.get("job_id")
    seeker_id = data.get("seeker_id")


    if not job_id or not seeker_id:
        return jsonify({"error": "Missing fields"}), 400

    from .models import SavedJob
    existing = SavedJob.query.filter_by(job_id=job_id, seeker_id=seeker_id).first()

    if existing:
        return jsonify({"message": "Already saved"}), 200

    saved = SavedJob(job_id=job_id, seeker_id=seeker_id)

    db.session.add(saved)
    db.session.commit()

    return jsonify({"message": "Job saved successfully"}), 201


@main.route("/job-seeker/<int:seeker_id>/saved-jobs", methods=["GET"])
def get_saved_jobs(seeker_id):
    from .models import SavedJob, Job
    saved = SavedJob.query.filter_by(seeker_id=seeker_id).all()
    job_ids = [s.job_id for s in saved]
    jobs = Job.query.filter(Job.id.in_(job_ids)).all()
    return jsonify([j.to_dict() for j in jobs])





@main.route("/unsave", methods=["POST"])
def unsave_job():
    data = request.get_json()
    job_id = data.get("job_id")
    seeker_id = data.get("seeker_id")

    if not job_id or not seeker_id:
        return jsonify({"error": "Missing fields"}), 400

    from .models import SavedJob
    saved = SavedJob.query.filter_by(job_id=job_id, seeker_id=seeker_id).first()

    if saved:
        db.session.delete(saved)
        db.session.commit()
        return jsonify({"message": "Job unsaved successfully"}), 200
    else:
        return jsonify({"message": "Not found"}), 404



# @main.route("/job-seeker/profile", methods=["POST"])
# @jwt_required()
# def save_job_seeker_profile():
#     from .models import JobSeeker, User
#     user_id = get_jwt_identity()

#     data = request.form
#     full_name = data.get("full_name")
#     title = data.get("title")
#     phone = data.get("phone")
#     country_code = data.get("country_code")
#     address = data.get("address")
#     skills = json.loads(data.get("skills") or "[]")
#     education = json.loads(data.get("education") or "[]")
#     bio = data.get("bio")

#     profile_image = request.files.get("profile_image")
#     profile_pic_url = None

#     if profile_image:
#         filename = secure_filename(profile_image.filename)
#         profile_image.save(os.path.join("uploads", filename))
#         profile_pic_url = f"http://localhost:8000/uploads/{filename}"

#     print("Received full_name:", full_name)
#     print("Received title:", title)
#     print("Received skills:", skills)
#     print("Received education:", education)

#     # Validate required fields
#     if not full_name or not title or not skills or not education:
#         return jsonify({"error": "Missing required fields"}), 400

#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     user.name = full_name
#     user.phone = phone
#     user.address = address
#     if profile_pic_url:
#         user.profile_pic_url = profile_pic_url

#     job_seeker = JobSeeker.query.get(user_id)
#     if not job_seeker:
#         job_seeker = JobSeeker(id=user_id)

#     job_seeker.full_name = full_name
#     job_seeker.title = title
#     job_seeker.phone = phone
#     job_seeker.country_code = country_code
#     job_seeker.address = address
#     job_seeker.bio = bio
#     if profile_pic_url:
#         job_seeker.profile_picture = profile_pic_url
#     job_seeker.skills = skills
#     job_seeker.education = education

#     db.session.add(user)
#     db.session.add(job_seeker)
#     db.session.commit()

#     return jsonify({"message": "Profile saved successfully"}), 200

@main.route("/job-seeker/profile", methods=["POST"])
@jwt_required()
def save_job_seeker_profile():
    from .models import JobSeeker, User
    user_id = get_jwt_identity()

    data = request.get_json()  
    full_name = data.get("full_name")
    title = data.get("title")
    phone = data.get("phone")
    country_code = data.get("country_code")
    address = data.get("address")
    skills = data.get("skills", [])
    education = data.get("education", [])
    bio = data.get("bio", "")
    profile_pic_url = data.get("profile_pic_url") 

    print("Received full_name:", full_name)
    print("Received title:", title)
    print("Received skills:", skills)
    print("Received education:", education)

    if not full_name or not title or not skills or not education:
        return jsonify({"error": "Missing required fields"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.name = full_name
    user.phone = phone
    user.address = address
    if profile_pic_url:
        user.profile_pic_url = profile_pic_url

    job_seeker = JobSeeker.query.get(user_id)
    if not job_seeker:
        job_seeker = JobSeeker(id=user_id)

    job_seeker.full_name = full_name
    job_seeker.title = title
    job_seeker.phone = phone
    job_seeker.country_code = country_code
    job_seeker.address = address
    job_seeker.bio = bio
    if profile_pic_url:
        job_seeker.profile_picture = profile_pic_url
    job_seeker.skills = skills
    job_seeker.education = education

    db.session.add(user)
    db.session.add(job_seeker)
    db.session.commit()

    return jsonify({"message": "Profile saved successfully"}), 200







# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ✅ Upload profile picture route
@main.route('/upload/profile-picture', methods=['POST'])
def upload_profile_picture():
    if 'profile_picture' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['profile_picture']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)  # Ensure folder exists

        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # Return relative URL to access the image later
        return jsonify({"url": f"/uploads/{filename}"}), 201

    return jsonify({"error": "Invalid file type"}), 400

from flask import send_from_directory
# ✅ Serve uploaded files route
@main.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)


@main.route("/job-seeker/profile", methods=["GET"])
@jwt_required()
def get_job_seeker_profile():
    user_id = get_jwt_identity()
    from .models import User, JobSeeker

    user = User.query.get(user_id)
    job_seeker = JobSeeker.query.get(user_id)

    if not user or not job_seeker:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "full_name": user.name,
        "email": user.email,
        "title": job_seeker.title,
        "phone": job_seeker.phone,
        "address": job_seeker.address,
        "profile_pic_url": job_seeker.profile_picture, 
        "skills": job_seeker.skills,
        "education": job_seeker.education,
        "bio": job_seeker.bio 
        
    }), 200


@main.route("/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    from .models import Job

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # Assuming your Job model has a to_dict() method
    return jsonify(job.to_dict()), 200



from sqlalchemy.orm import joinedload
@main.route("/jobs/<int:job_id>/applicants", methods=["GET"])
def get_applicants_for_job(job_id):
    from .models import Application

    applicants = (
        Application.query
        .options(joinedload(Application.job_seeker))
        .filter_by(job_id=job_id)
        .all()
    )

    return jsonify([a.to_dict() for a in applicants]), 200






# from flask_login import current_user  # optional if using session or other method



@main.route("/employer/company-info", methods=["POST"])
def update_employer_info():
    data = request.get_json()

    user_id = data.get("user_id")
    company_name = data.get("company_name")
    company_desc = data.get("company_desc")

    if not user_id or not company_name:
        return jsonify({"error": "Missing required fields"}), 400

    employer = Employer.query.get(user_id)
    if not employer:
        return jsonify({"error": "Employer not found"}), 404

    employer.company_name = company_name
    employer.company_desc = company_desc
    db.session.commit()

    return jsonify({"message": "Employer info updated"}), 200




from werkzeug.utils import secure_filename


UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main.route('/employer/upload-image', methods=['POST'])
def upload_employer_image():
    user_id = request.form.get('user_id')
    if 'file' not in request.files or not user_id:
        return jsonify({'error': 'Missing file or user_id'}), 400

    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file.save(filepath)

        employer = Employer.query.get(user_id)
        if not employer:
            return jsonify({'error': 'Employer not found'}), 404

        image_type = request.form.get('image_type')  # instead of 'type'

        if image_type == 'logo':
            employer.logo_url = f'/uploads/{filename}'
        elif image_type == 'banner':
            employer.banner_url = f'/uploads/{filename}'
        else:
            return jsonify({'error': 'Invalid image type'}), 400

        db.session.commit()
        print('Received file:', file.filename if file else None)
        print('Received user_id:', user_id)
        print('Received image_type:', request.form.get('image_type'))

        return jsonify({'message': 'Image uploaded', 'url': f'/uploads/{filename}'}), 200

    return jsonify({'error': 'Invalid file format'}), 400


@main.route("/employer/founding-info", methods=["POST"])
def update_founding_info():
    data = request.get_json()
    user_id = data.get("user_id")

    employer = Employer.query.get(user_id)
    if not employer:
        return jsonify({"error": "Employer not found"}), 404

    employer.founded_year = data.get("founded_year")
    employer.num_employees = data.get("employees")    # was: employee_count
    employer.funding = data.get("funding")            # was: funding_stage
    employer.industry = data.get("industry")

    db.session.commit()
    return jsonify({"message": "Founding info saved"}), 200


@main.route("/employer/contact-info", methods=["POST"])
def update_contact_info():
    data = request.get_json()
    user_id = data.get("user_id")

    employer = Employer.query.get(user_id)
    if not employer:
        return jsonify({"error": "Employer not found"}), 404

    employer.address = data.get("address")
    employer.phone = data.get("phone")
    employer.email = data.get("email")

    db.session.commit()
    return jsonify({"message": "Contact info saved"}), 200




@main.route("/employer/social-media", methods=["POST"])
def update_social_media():
    data = request.get_json()
    user_id = data.get("user_id")
    social_links = data.get("social_links", [])

    employer = Employer.query.get(user_id)
    if not employer:
        return jsonify({"error": "Employer not found"}), 404

    # Convert list to dict: {'facebook': 'url', 'twitter': 'url', ...}
    social_dict = {item['platform']: item['url'] for item in social_links if item['url']}

    # Store as JSON string or JSON field (if using PostgreSQL)
    employer.social_links = json.dumps(social_dict)

    db.session.commit()
    return jsonify({"message": "Social media links updated"}), 200




@main.route('/employer/profile', methods=['GET'])
@jwt_required()
def get_employer_profile():
    user_id = get_jwt_identity()

    employer = Employer.query.get(user_id)
    if not employer:
        return jsonify({'error': 'Employer not found'}), 404

    profile_data = {
        'company_name': employer.company_name,
        'company_desc': employer.company_desc,
        'logo_url': employer.logo_url,
        'banner_url': employer.banner_url,
        'founded_year': employer.founded_year,
        'employees': employer.num_employees,
        'funding': employer.funding,
        'industry': employer.industry,
        'address': employer.address,
        'phone': employer.phone,
        'email': employer.email,
        'social_links': employer.social_links or [],
    }

    return jsonify(profile_data), 200



@main.route("/jobs/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    data = request.get_json()

    job = Job.query.get_or_404(job_id)

    job.title = data.get("title", job.title)
    job.job_type = data.get("type", job.job_type)
    job.location = data.get("location", job.location)
    job.is_remote = data.get("is_remote", job.is_remote)
    job.description = data.get("description", job.description)
    job.requirements = data.get("requirements", job.requirements)
    job.salary = data.get("salary", job.salary)
    job.deadline = data.get("deadline", job.deadline)

    # Convert list of skills to a comma-separated string if necessary
    if isinstance(data.get("skills"), list):
        job.skills = ",".join(data["skills"])
    elif data.get("skills") is not None:
        job.skills = data["skills"]  # fallback if sent as string

    db.session.commit()

    return jsonify({"message": "Job updated successfully"}), 200



@main.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Job.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted"}), 200


@main.route('/jobs/<int:job_id>/status', methods=['PATCH'])
def update_job_status(job_id):
    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['active', 'expired']:
        return jsonify({"error": "Invalid status"}), 400

    job = Job.query.get_or_404(job_id)
    job.status = new_status
    db.session.commit()

    return jsonify({"message": f"Job status updated to {new_status}"}), 200



@main.route("/notifications/<int:user_id>/mark-all-read", methods=["PATCH"])
def mark_all_notifications_as_read(user_id):
    print(f"PATCH route hit for user_id={user_id}")
    from .models import Notification
    from app import db

    notifications = Notification.query.filter_by(receiver_id=user_id, read=False).all()

    if not notifications:
        return jsonify({"message": "No unread notifications"}), 200

    for notif in notifications:
        notif.read = True
        print(f"Marked notification {notif.id} as read")
    db.session.commit()
    return jsonify({"message": "Marked all as read"}), 200



admin_bp = Blueprint('admin', __name__)



@admin_bp.route("/api/admin/users", methods=["GET"])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify([
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": "active",  # Adjust if you track status
            "joinDate": user.created_at.strftime('%Y-%m-%d') if hasattr(user, 'created_at') else "N/A"
        }
        for user in users
    ])


@admin_bp.route('/api/admin/jobs', methods=['GET'])
@jwt_required()
def get_all_jobs():
    identity = get_jwt_identity()
    user = User.query.get(identity)

    if user.role != "admin":
        return jsonify({"msg": "Admins only"}), 403

    jobs = Job.query.options(joinedload(Job.employer)).all()
    return jsonify([job.to_dict() for job in jobs]), 200



@main.route("/reports", methods=["POST"])
@jwt_required()
def create_report():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    reason = data.get("reason")
    job_id = data.get("job_id")

    if not reason or not job_id:
        return jsonify({"msg": "Missing report reason or job ID"}), 400

    report = Report(
        job_id=job_id,
        reporter_id=current_user_id,
        reason=reason
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({"msg": "Report submitted successfully"}), 201



@admin_bp.route("/api/admin/reports", methods=["GET"])
@jwt_required()
def get_reports():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'admin':
        return jsonify({"msg": "Admins only"}), 403

    reports = Report.query.order_by(Report.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reports])



@admin_bp.route("/api/admin/reports/<int:report_id>/resolve", methods=["POST"])
@jwt_required()
def resolve_report(report_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'admin':
        return jsonify({"msg": "Admins only"}), 403

    report = Report.query.get_or_404(report_id)
    report.status = "resolved"
    db.session.commit()
    return jsonify({"msg": "Report resolved successfully"})



@admin_bp.route("/api/admin/stats", methods=["GET"])
@jwt_required()
def get_admin_panel_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != "admin":
        return jsonify({"msg": "Admins only"}), 403

    total_users = User.query.count()
    active_jobs = Job.query.filter_by(status="active").count()
    applications = Application.query.count()
    pending_reports = Report.query.filter_by(status="pending").count()

    return jsonify({
        "totalUsers": total_users,
        "activeJobs": active_jobs,
        "applications": applications,
        "pendingReports": pending_reports
    })


# @main.route("/send-verification-code", methods=["POST"])
# def send_verification_code():
#     data = request.get_json()
#     email = data.get("email")

#     if not email:
#         return jsonify({"message": "Email is required."}), 400

#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({"message": "User not found."}), 404

#     # Generate random 6-digit code
#     code = str(random.randint(100000, 999999))

#     # Save to user
#     user.verification_code = code
#     db.session.commit()

#     # Send email
#     try:
#         send_verification_email(user.email, code)
#         return jsonify({"message": "Verification code sent."}), 200
#     except Exception as e:
#         return jsonify({"message": "Failed to send email.", "error": str(e)}), 500


# @main.route("/verify-email", methods=["POST"])
# def verify_email():
#     data = request.get_json()
#     email = data.get("email")
#     code = data.get("code")

#     if not email or not code:
#         return jsonify({"message": "Email and code are required."}), 400

#     user = User.query.filter_by(email=email).first()

#     if not user:
#         return jsonify({"message": "User not found."}), 404

#     if user.verification_code != code:
#         return jsonify({"message": "Invalid verification code."}), 400

#     user.is_verified = True
#     user.verification_code = None
#     db.session.commit()

#     return jsonify({"message": "Email successfully verified."}), 200

# @main.route("/verify-email", methods=["POST"])
# def verify_email():
#     data = request.get_json()
#     email = data.get("email")
#     code = data.get("code")

#     if not email or not code:
#         return jsonify({"message": "Email and code are required."}), 400

#     user = User.query.filter_by(email=email).first()

#     if not user:
#         return jsonify({"message": "User not found."}), 404

#     if user.verification_code != code:
#         return jsonify({"message": "Invalid verification code."}), 400

#     # ✅ Update verification status
#     user.is_verified = True
#     user.verification_code = None
#     db.session.commit()

#     # ✅ Generate JWT access token
#     access_token = create_access_token(identity=str(user.id))

#     return jsonify({
#         "message": "Email successfully verified.",
#         "access_token": access_token,
#         "user": {
#             "id": user.id,
#             "name": user.name,
#             "email": user.email,
#             "role": user.role,
#             "is_verified": user.is_verified
#         }
#     }), 200

# @main.route("/verify-email", methods=["POST"])
# def verify_email():
#     data = request.get_json()
#     email = data.get("email")
#     code = data.get("code")

#     if not email or not code:
#         return jsonify({"message": "Email and code are required."}), 400

#     # ✅ Check if the email exists in pending users
#     user_data = pending_users.get(email)
#     if not user_data:
#         return jsonify({"message": "No verification request found for this email."}), 404

#     if user_data["code"] != code:
#         return jsonify({"message": "Invalid verification code."}), 400

#     # ✅ Create user in DB now that email is verified
#     new_user = User(
#         name=user_data["name"],
#         email=email,
#         password=user_data["password"],
#         role=user_data["role"],
#         is_verified=True
#     )
#     db.session.add(new_user)
#     db.session.commit()

#     # ✅ Remove from pending users
#     pending_users.pop(email)

#     # ✅ Generate JWT access token
#     access_token = create_access_token(identity=str(new_user.id))

#     return jsonify({
#         "message": "Email successfully verified.",
#         "access_token": access_token,
#         "user": {
#             "id": new_user.id,
#             "name": new_user.name,
#             "email": new_user.email,
#             "role": new_user.role,
#             "is_verified": new_user.is_verified
#         }
#     }), 200

from werkzeug.security import generate_password_hash
# @main.route("/verify-email", methods=["POST"])
# def verify_email():
#     data = request.get_json()
#     email = data.get("email")
#     code = data.get("code")

#     if not email or not code:
#         return jsonify({"message": "Email and code are required."}), 400

#     # ✅ Lookup from pending in-memory store
#     user_data = pending_users.get(email)
#     if not user_data:
#         return jsonify({"message": "No verification request found for this email."}), 404

#     if user_data["code"] != code:
#         return jsonify({"message": "Invalid verification code."}), 400

#     # ✅ Hash the password
#     hashed_password = generate_password_hash(user_data["password"])

#     # ✅ Create verified user
#     new_user = User(
#         name=user_data["name"],
#         email=email,
#         password_hash=hashed_password,
#         role=user_data["role"],
#         is_verified=True
#     )
#     db.session.add(new_user)
#     db.session.commit()

#     # ✅ Clean up pending
#     pending_users.pop(email)

#     # ✅ Issue access token
#     access_token = create_access_token(identity=str(new_user.id))

#     return jsonify({
#         "message": "Email successfully verified.",
#         "access_token": access_token,
#         "user": {
#             "id": new_user.id,
#             "name": new_user.name,
#             "email": new_user.email,
#             "role": new_user.role,
#             "is_verified": new_user.is_verified
#         }
#     }), 200

@main.route("/verify-email", methods=["POST"])
def verify_email():
    from datetime import datetime, timezone
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return jsonify({"message": "Email and code are required."}), 400

    # ✅ Lookup from database pending users
    pending_user = PendingUser.query.filter_by(email=email).first()
    if not pending_user:
        return jsonify({"message": "No verification request found for this email."}), 404

    # Check if the pending registration has expired
    # Handle both naive and timezone-aware datetime comparisons
    current_time = datetime.now(timezone.utc)
    expires_at = pending_user.expires_at
    
    # If expires_at is naive, make it timezone-aware (assume UTC)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < current_time:
        db.session.delete(pending_user)
        db.session.commit()
        return jsonify({"message": "Verification code has expired. Please request a new one."}), 400

    if pending_user.verification_code != code:
        return jsonify({"message": "Invalid verification code."}), 400

    # ✅ Create verified user
    new_user = User(
        name=pending_user.name,
        email=email,
        password_hash=pending_user.password_hash,  # Already hashed in PendingUser
        role=pending_user.role,
        is_verified=True
    )
    db.session.add(new_user)
    db.session.commit()

    # ✅ Create Employer if role is 'employer'
    if new_user.role == 'employer':
        employer = Employer(id=new_user.id, company_name="TBD", company_desc="TBD")
        db.session.add(employer)
    elif new_user.role == 'job_seeker':
        job_seeker = JobSeeker(id=new_user.id)
        db.session.add(job_seeker)
    
    db.session.commit()

    # ✅ Clean up pending user from database
    db.session.delete(pending_user)
    db.session.commit()

    # ✅ Issue access token
    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "message": "Email successfully verified.",
        "access_token": access_token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "is_verified": new_user.is_verified
        }
    }), 200


# @main.route("/register", methods=["POST"])
# def register():
#     data = request.get_json()
#     email = data.get("email")
#     code = data.get("code")

#     if not email or not code:
#         return jsonify({"message": "Email and code are required."}), 400

#     pending = pending_users.get(email)
#     if not pending:
#         return jsonify({"message": "No pending registration for this email."}), 404

#     if pending["code"] != code:
#         return jsonify({"message": "Invalid verification code."}), 400

#     # Create user
#     user = User(name=pending["name"], email=email, role=pending["role"])
#     user.set_password(pending["password"])
#     user.is_verified = True
#     db.session.add(user)
#     db.session.commit()

#     # Create role-specific
#     if user.role == "job_seeker":
#         from .models import JobSeeker
#         db.session.add(JobSeeker(id=user.id))
#     elif user.role == "employer":
#         from .models import Employer
#         db.session.add(Employer(id=user.id, company_name="TBD", company_desc="TBD"))

#     db.session.commit()
#     del pending_users[email]  # Clean up

#     token = create_access_token(identity=str(user.id))

#     return jsonify({
#         "message": "Registration complete.",
#         "access_token": token,
#         "user": {
#             "id": user.id,
#             "name": user.name,
#             "email": user.email,
#             "role": user.role
#         }
#     }), 200


@main.route("/register", methods=["POST"])
def register():
    from datetime import datetime, timezone
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return jsonify({"message": "Email and code are required."}), 400

    # Check for pending registration in database
    pending_user = PendingUser.query.filter_by(email=email).first()
    if not pending_user:
        return jsonify({"message": "No pending registration for this email."}), 404

    # Check if the pending registration has expired
    # Handle both naive and timezone-aware datetime comparisons
    current_time = datetime.now(timezone.utc)
    expires_at = pending_user.expires_at
    
    # If expires_at is naive, make it timezone-aware (assume UTC)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < current_time:
        db.session.delete(pending_user)
        db.session.commit()
        return jsonify({"message": "Verification code has expired. Please request a new one."}), 400

    if pending_user.verification_code != code:
        return jsonify({"message": "Invalid verification code."}), 400

    # Create user
    user = User(name=pending_user.name, email=email, role=pending_user.role)
    user.password_hash = pending_user.password_hash  # Already hashed
    user.is_verified = True
    db.session.add(user)
    db.session.commit()  # Commit user first, to get user ID

    # Create role-specific model
    if user.role == "job_seeker":
        from .models import JobSeeker
        db.session.add(JobSeeker(id=user.id))
        print(f"JobSeeker created with id {user.id}")
    elif user.role == "employer":
        from .models import Employer
        employer = Employer(id=user.id, company_name="TBD", company_desc="TBD")
        db.session.add(employer)
        print(f"Employer created with id {user.id}")

    db.session.commit()  # Commit changes, including Employer/JobSeeker

    # Clean up pending registration from database
    db.session.delete(pending_user)
    db.session.commit()

    # Generate JWT token
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Registration complete.",
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200






@main.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "No user found with that email."}), 404

    # Generate a 6-digit reset code
    code = str(random.randint(100000, 999999))
    user.reset_code = code
    db.session.commit()

    # Send code via email
    try:
        send_reset_email(user.email, code)
        return jsonify({"message": "Password reset code sent successfully."}), 200
    except Exception as e:
        return jsonify({
            "message": "Failed to send reset code.",
            "error": str(e)
        }), 500


@main.route('/verify-reset-code', methods=['POST'])
def verify_reset_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"message": "Email and code are required."}), 400

    user = User.query.filter_by(email=email).first()

    if not user or user.reset_code != code:
        return jsonify({"message": "Invalid reset code."}), 400

    return jsonify({"message": "Reset code verified successfully."}), 200


@main.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    if not all([email, code, new_password]):
        return jsonify({"message": "Missing required fields."}), 400

    user = User.query.filter_by(email=email).first()

    if not user or user.reset_code != code:
        return jsonify({"message": "Invalid email or reset code."}), 400

    # Update the password
    user.set_password(new_password)
    user.reset_code = None  # Invalidate the used code
    db.session.commit()

    return jsonify({"message": "Password reset successfully."}), 200


@main.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.check_password(current_password):
        return jsonify({"message": "Current password is incorrect"}), 400

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password updated successfully"}), 200


@main.route("/cleanup-expired-registrations", methods=["POST"])
@admin_required
def cleanup_expired_registrations():
    """Admin endpoint to clean up expired pending user registrations"""
    try:
        count = PendingUser.cleanup_expired()
        return jsonify({
            "message": f"Successfully cleaned up {count} expired pending registrations"
        }), 200
    except Exception as e:
        return jsonify({
            "error": f"Failed to cleanup expired registrations: {str(e)}"
        }), 500


@main.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted successfully"}), 200

@main.route("/upload", methods=["POST"])
def upload_resume_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(upload_dir, exist_ok=True)

    filepath = os.path.join(upload_dir, filename)
    file.save(filepath)
    base_url = request.host_url.rstrip("/")
    # Optional: You can return the URL or just confirm
    return jsonify({
        "message": "File uploaded successfully",
        "url": f"{base_url}/uploads/{filename}"
    }), 200
