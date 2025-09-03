import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useLocation } from 'wouter';
import RegistrationProgress from '@/components/auth/RegistrationProgress';
import logo from '@/assets/logo.svg';
import { apiUrl, imageUrl } from '@/config';

/**
 * Student Registration Page
 * 
 * Comprehensive registration page for students/job seekers
 * Collects personal information, education, and skills
 */
const StudentRegister = () => {
  // Personal information state
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+962');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [, navigate] = useLocation();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const isValidJordanianPhone = (number: string) => /^7\d{8}$/.test(number);// expects 9 digits starting with 7
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeParsedData, setResumeParsedData] = useState<any>(null);
  const [cvValidated, setCvValidated] = useState(false);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});





 
const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setResumeFile(file);
    setCvPreview(file.name);
    setCvValidated(false);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(apiUrl("/api/upload-resume"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ This was missing
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      setCvValidated(true);
      if (data.cv_url) {
      setResumeUrl(data.cv_url); // ✅ Match backend key
  }

    } catch (err) {
      console.error("Resume upload error:", err);
      setUploadError("Something went wrong. Please try again.");
    }
  }
};




  // Education state
  const [education, setEducation] = useState([
    { degree: '', institution: '', yearStart: '', yearEnd: '', description: '' }
  ]);

  // Skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  // Handle profile picture selection
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const res = await fetch(apiUrl("/api/upload/profile-picture"), {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setProfilePicturePreview(imageUrl(data.url));
      } else {
        alert(data.error || "Failed to upload profile picture.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  }
};
;

const renderResumeUpload = () => (
  <>
    <h1 className="text-2xl font-bold mb-6">Upload Your Resume</h1>

    <p className="text-gray-600 mb-4">
      You can upload your own resume file. We'll verify it's a valid CV and extract your details.
    </p>

    <div
      className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center h-44 cursor-pointer ${cvPreview ? 'border-[#F6C500]' : 'border-gray-300'}`}
      onClick={() => document.getElementById('resume-upload')?.click()}
    >
      {cvPreview ? (
        <>
          <i className="fas fa-file-alt text-4xl text-[#F6C500] mb-2"></i>
          <p className="text-gray-800">{cvPreview}</p>
          <p className="text-sm text-green-600 mt-1">{cvValidated ? 'Resume validated ✅' : 'Pending validation...'}</p>
        </>
      ) : (
        <>
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
          <p className="text-sm text-gray-500">Click or drop your resume file here (PDF, DOCX)</p>
        </>
      )}
      <input
        type="file"
        id="resume-upload"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleResumeUpload}
      />
    </div>

    {uploadError && (
      <p className="text-sm text-red-600 mt-2">{uploadError}</p>
    )}

    <p className="text-sm text-gray-600 mt-4 text-center">
  Don’t have a resume?{" "}
  <Link to="/resume-builder" className="text-[#F6C500] underline font-medium">
    Use our Resume Builder
  </Link>
</p>


    <p className="text-sm text-gray-500 mt-4">
      You cannot apply to jobs unless a resume is uploaded or built using the Resume Builder.
    </p>
  </>
);



  // Add a new education entry
  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', yearStart: '', yearEnd: '', description: '' }]);
  };

  // Update an education entry
  const updateEducation = (index: number, field: keyof typeof education[0], value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  // Remove an education entry
  const removeEducation = (index: number) => {
    if (education.length > 1) {
      const updatedEducation = [...education];
      updatedEducation.splice(index, 1);
      setEducation(updatedEducation);
    }
  };

  // Add a skill
  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill('');
    }
  };

  // Remove a skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Progress bar steps
  const registrationSteps = [
    { icon: <i className="fas fa-user"></i>, label: "Personal Info" },
    { icon: <i className="fas fa-graduation-cap"></i>, label: "Education" },
    { icon: <i className="fas fa-tools"></i>, label: "Skills" },
    { icon: <i className="fas fa-file-upload"></i>, label: "Resume" },
  ];



const handleNext = async (e: React.FormEvent) => {
  e.preventDefault();

  if (currentStep < registrationSteps.length - 1) {
    setCurrentStep(currentStep + 1);
    return;
  }

  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Missing token");
      return;
    }

    // Upload profile picture if selected
    let uploadedImageUrl = profilePicturePreview;

    if (profilePicture && !profilePicturePreview) {
      const formData = new FormData();
      formData.append("profile_picture", profilePicture);

      const uploadResponse = await fetch(apiUrl("/api/upload/profile-picture"), {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        console.error("Image upload failed:", uploadData);
        return;
      }

      uploadedImageUrl = imageUrl(uploadData.url);
    }

    const mainEducation = education[0];
    const major = mainEducation?.degree || '';
    const university = mainEducation?.institution || '';

    // Submit profile data even if resumeUrl is null
    const response = await fetch(apiUrl("/api/job-seeker/profile"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        full_name: fullName,
        title,
        phone: `${countryCode} ${phone}`,
        address,
        profile_pic_url: uploadedImageUrl,
        skills,
        education,
        major,
        university,
        cv_url: resumeUrl || null,  // ← allow null CV
        bio 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to save profile:", errorData);
      return;
    }

    navigate("/resume-builder"); // 👈 Navigate to resume builder after saving

  } catch (err) {
    console.error("Error submitting registration:", err);
  }
};




  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/register');
    }
  };

  // Country codes for dropdownf
  const countryCodes = [
    { code: '+962', flag: 'JD', name: 'Jordan' },
  ];

  // Generate year options for education dropdowns
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Render personal information form
  const renderPersonalInfo = () => (
    <>
      <h1 className="text-2xl font-bold mb-8">Personal Information</h1>
      
      {/* Profile Picture */}
      <div className="mb-8 flex flex-col items-center">
        <div
          className={`w-32 h-32 rounded-full border-2 ${
            profilePicturePreview ? 'border-[#F6C500]' : 'border-dashed border-gray-300'
          } flex items-center justify-center overflow-hidden mb-4`}
          onClick={() => document.getElementById('profile-picture')?.click()}
        >
          {profilePicturePreview ? (
            <img
              src={profilePicturePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">
              <i className="fas fa-user text-4xl"></i>
            </div>
          )}
        </div>
        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="hidden"
        />
        <button
          type="button"
          className="text-sm text-[#F6C500] hover:underline"
          onClick={() => document.getElementById('profile-picture')?.click()}
        >
          Upload profile picture
        </button>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="full-name" className="block font-medium mb-2">
            Full Name
          </label>
          <Input
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-12"
          />
          

        </div>
        <div>
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Engineer, Student"
            required
            className="h-12"
          />
          
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-6">
        <div>
      <label htmlFor="phone" className="block font-medium mb-2">
        Phone (Jordanian)
      </label>
      <div className="flex items-center">
        <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-700 text-sm">+880</span>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="1XXXXXXXXX"
          className="h-12 rounded-l-none"
          required
        />
        
      </div>
</div>

      </div>

      {/* Address */}
      <div className="mb-8">
        <label htmlFor="address" className="block font-medium mb-2">
          Address
        </label>
        <Select value={address} onValueChange={setAddress}>
  <SelectTrigger className="h-12">
    <SelectValue placeholder="Select city" />
  </SelectTrigger>
  <SelectContent>
    {[
      "Dhaka",
      "Chittagong",
      "Khulna",
      "Rajshahi",
      "Barishal",
      "Sylhet",
      "Mymensingh",
      "Rangpur",
      "Comilla",
      "Gazipur",
      "Narsingdi",
      "Tangail",
      "Jessore",
      "Kushtia",
      "Bogra",
      "Patuakhali",
      "Dinajpur",
      "Cox's Bazar",
      "Noakhali",
      "Narail"
    ].map(city => (
      <SelectItem key={city} value={city}>{city}</SelectItem>
    ))}
  </SelectContent>
</Select>

      </div>

      {/* Bio */}
<div className="mb-8">
  <label htmlFor="bio" className="block font-medium mb-2">
    Bio
  </label>
  <Textarea
    id="bio"
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Tell us a little about yourself..."
    rows={4}
  />
</div>

    </>
  );

  // Render education form
  const renderEducation = () => (
    <>
      <h1 className="text-2xl font-bold mb-8">Education</h1>

      {education.map((edu, index) => (
        <div key={index} className="mb-8 p-6 border rounded-lg bg-gray-50 relative">
          {education.length > 1 && (
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => removeEducation(index)}
            >
              <i className="fas fa-times"></i>
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-medium mb-2">Degree/Certification</label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="h-12"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Institution</label>
              <Select
            value={edu.institution}
            onValueChange={(value) => updateEducation(index, 'institution', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your university" />
            </SelectTrigger>
            <SelectContent>
              {[
                  "University of Dhaka",
                  "Bangladesh University of Engineering and Technology (BUET)",
                  "Jahangirnagar University",
                  "Rajshahi University",
                  "Chittagong University",
                  "Khulna University",
                  "Bangladesh Agricultural University",
                  "Islamic University, Kushtia",
                  "Jagannath University",
                  "North South University",
                  "East West University",
                  "BRAC University",
                  "Independent University, Bangladesh (IUB)",
                  "American International University-Bangladesh (AIUB)",
                  "Ahsanullah University of Science and Technology",
                  "University of Liberal Arts Bangladesh (ULAB)",
                  "Premier University, Chittagong",
                  "University of Barishal",
                  "Patuakhali Science and Technology University",
                  "Hajee Mohammad Danesh Science & Technology University"
                ].map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-medium mb-2">Start Year</label>
              <Select
                value={edu.yearStart}
                onValueChange={(value) => updateEducation(index, 'yearStart', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={`start-${year}`} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block font-medium mb-2">End Year (or Expected)</label>
              <Select
                value={edu.yearEnd}
                onValueChange={(value) => updateEducation(index, 'yearEnd', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present / In Progress</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={`end-${year}`} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Description</label>
            <Textarea
              value={edu.description}
              onChange={(e) => updateEducation(index, 'description', e.target.value)}
              placeholder="Briefly describe your studies, achievements, etc."
              rows={3}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 mb-8 border-dashed"
        onClick={addEducation}
      >
        <i className="fas fa-plus mr-2"></i> Add Another Education
      </Button>
    </>
  );

  // Render skills form
  const renderSkills = () => (
    <>
      <h1 className="text-2xl font-bold mb-8">Skills</h1>

      <div className="mb-6">
        <label className="block font-medium mb-2">Add Your Skills</label>
        <div className="flex">
          <Input
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            placeholder="e.g. JavaScript, Photoshop, Project Management"
            className="h-12 flex-grow mr-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button
            type="button"
            className="h-12 px-6"
            style={{ backgroundColor: "#F6C500", color: "#000000" }}
            onClick={addSkill}
          >
            Add
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Press Enter to add multiple skills quickly
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 rounded-full px-4 py-2"
          >
            <span className="mr-2">{skill}</span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => removeSkill(skill)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-gray-400 italic">No skills added yet</p>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto">
        {/* Header with logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <img src={logo} alt="JobHive Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">JobHive</span>
          </Link>
        </div>

        {/* Progress bar */}
        <RegistrationProgress currentStep={currentStep} steps={registrationSteps} />

        <form onSubmit={handleNext} className="max-w-4xl mx-auto">
          {currentStep === 0 && renderPersonalInfo()}
          {currentStep === 1 && renderEducation()}
          {currentStep === 2 && renderSkills()}
          {currentStep === 3 && renderResumeUpload()}


          {/* Footer */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-40 h-12 font-medium"
              onClick={handlePrevious}
            >
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </Button>
            <Button
              type="submit"
              className="w-40 h-12 font-medium"
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              disabled={false}
            >
              {currentStep === registrationSteps.length - 1 ? 'Complete' : 'Continue'}{' '}
              <i className="fas fa-arrow-right ml-1"></i>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;