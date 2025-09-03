#!/bin/bash

# Script to replace hardcoded localhost URLs with API_BASE configuration
# This script helps complete the migration from hardcoded URLs to configurable API_BASE

echo "🔧 Updating remaining files to use API_BASE instead of hardcoded localhost URLs..."

# Define the client source directory
CLIENT_SRC="client/src"

# Files that still need to be updated (based on the grep search results)
declare -a files=(
    "pages/StudentRegister/index.tsx"
    "pages/ResetPassword.tsx"  
    "pages/Profiles/JobSeekerProfile.tsx"
    "pages/Profiles/EmployerProfile.tsx"
    "pages/JobDetailsPage.tsx"
    "pages/ForgotPassword.tsx"
    "pages/EmployerRegister/SocialMedia.tsx"
    "pages/EmployerRegister/FoundingInfo.tsx"
    "pages/EmployerRegister/Contact.tsx"
    "pages/EmployerRegister/CompanyInfo.tsx"
    "pages/EmailVerification.tsx"
    "pages/EditJobPage.tsx"
    "pages/ApplicantsPage.tsx"
    "pages/AdminPanel.tsx"
)

echo "📝 Files that need manual review and updating:"
for file in "${files[@]}"; do
    echo "  - $CLIENT_SRC/$file"
done

echo ""
echo "🔍 Search for remaining hardcoded URLs:"
echo "grep -r 'http://localhost:8000' $CLIENT_SRC/ --include='*.tsx' --include='*.ts'"

echo ""
echo "✅ Steps completed so far:"
echo "  1. Added API_BASE configuration in config.ts"
echo "  2. Updated core utility files (jobUtils.ts, resumeUtils.ts)"
echo "  3. Updated UserContext.tsx with API_BASE imports"
echo "  4. Updated major components (JobListings, JobCard, Header)"
echo "  5. Updated key pages (Dashboard, PostJob, ResumeBuilder)"

echo ""
echo "🎯 Next steps:"
echo "  1. Update remaining files listed above"
echo "  2. Add 'import { API_BASE } from '../config';' to each file"
echo "  3. Replace 'http://localhost:8000' with API_BASE"
echo "  4. For image URLs, use API_BASE without '/api' prefix"
echo "  5. Test the application with different API_BASE values"

echo ""
echo "💡 Example replacement patterns:"
echo "  Before: fetch('http://localhost:8000/api/endpoint')"
echo "  After:  fetch(\`\${API_BASE}/api/endpoint\`)"
echo ""
echo "  Before: src=\"http://localhost:8000/uploads/image.jpg\""
echo "  After:  src={\`\${API_BASE}/uploads/image.jpg\`}"
