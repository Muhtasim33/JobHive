# 💼 JobHive – Job Portal for Students and Fresh Graduates

JobHive is a full-stack job portal designed to help students and fresh graduates discover jobs, build resumes, and connect with employers — all in one place.

---

## 🔍 Project Overview

JobHive offers personalized job recommendations, a resume builder, job tracking dashboards, and employer messaging.

This is a **full-stack project**:

- 🔧 **Frontend**: React + TypeScript
- 🔥 **Backend**: Python (Flask), PostgreSQL
- 📬 **Email Service**: Brevo SMTP
- 📄 **Resume Parser**: Affinda API

---

## 🗂️ Project Structure

JobHivePortal-1/
├── client/ # React frontend (Vite + TypeScript)
├── server/ # Flask backend
│ ├── app/ # Backend modules (routes, models, config)
│ ├── uploads/ # Uploaded resume files
│ ├── run.py # Backend entry point
│ └── .env.example # Sample environment file
├── .gitignore
├── README.md

---

## 🚀 How to Run Locally

### 1. Clone the Repo

```bash
git clone https://github.com/Zahin2470/JobPortal.git
cd JobHivePortal

2. Backend Setup
cd server
python -m venv venv
#venv\Scripts\activate           # On Windows
source venv/bin/activate     # On macOS/Linux

pip install -r requirements.txt
cp .env.example .env           # Add your actual credentials
python run.py
Runs the backend at: http://localhost:8000


3. Frontend Setup
cd ../client
npm install
npm run dev
Runs the frontend at: http://localhost:5173

🔑 Environment Variables
Update your .env file based on .env.example inside /server/.

You’ll need:

PostgreSQL DB URL
JWT secret key
Brevo email SMTP credentials
Affinda API key


💡 Features

🔍 Job listings with filters (skills, location, job type)
📄 Resume Builder with export & preview
📬 Email verification & onboarding
🧠 Employer job posting & applicant tracking
👤 Role-based dashboards (Student vs Employer)
📁 File uploads (CVs)
🔐 JWT Authentication

🧰 Built With
Frontend
React, TypeScript, Tailwind CSS

Backend
Flask, SQLAlchemy, PostgreSQL

Extras
Affinda API, Brevo SMTP, JWT, Cloud Deployment Ready

👋 Author
Made with Jahin,Sakif,Emon

🙋 Contact
If you’d like to collaborate or hire, connect with me on LinkedIn.
