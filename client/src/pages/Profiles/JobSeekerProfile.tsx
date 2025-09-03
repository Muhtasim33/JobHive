import React, { useState, useEffect } from 'react';
import { useUser, User } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiUrl, imageUrl } from '@/config';

/**
 * Profile Page Component
 * 
 * Allows users to view and edit their profile information
 * Provides sections for personal details, skills, and account settings
 */
const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useUser();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
  length: false,
  lowercase: false,
  uppercase: false,
  symbol: false
});
const [passwordError, setPasswordError] = useState<string | null>(null);

 



  type EducationEntry = {
  degree: string;
  institution: string;
  yearStart: string;
  yearEnd: string;
  description?: string;
};
const handleDeleteAccount = async () => {
  const confirmed = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
  if (!confirmed) return;

  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(apiUrl("/api/delete-account"), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully removed.",
      });

      localStorage.removeItem("access_token");
      navigate("/login");
    } else {
      toast({
        title: "Deletion Failed",
        description: data.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  } catch (err) {
    toast({
      title: "Error",
      description: "Network error. Try again.",
      variant: "destructive",
    });
  }
};

const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast({
      title: "Missing Fields",
      description: "Please fill in all fields.",
      variant: "destructive",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    toast({
      title: "Password Mismatch",
      description: "New passwords do not match.",
      variant: "destructive",
    });
    return;
  }

  // ✅ Password strength validation check
  const allRequirementsMet = Object.values(passwordValidation).every(Boolean);
  if (!allRequirementsMet) {
    toast({
      title: "Password Too Weak",
      description: "Please meet all password requirements.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  const token = localStorage.getItem('access_token');
  try {
    const res = await fetch(apiUrl('/api/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast({
        title: "Password Updated",
        description: "Your new password has been saved.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast({
        title: "Update Failed",
        description: data.message || "Password change failed.",
        variant: "destructive",
      });
    }
  } catch (err) {
    toast({
      title: "Network Error",
      description: "Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};




useEffect(() => {
  const hasMinLength = newPassword.length >= 8;
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

  setPasswordValidation({
    length: hasMinLength,
    lowercase: hasLowercase,
    uppercase: hasUppercase,
    symbol: hasSymbol
  });

  setPasswordError(null);
}, [newPassword]);


  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);


  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(apiUrl("/api/job-seeker/profile"), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFullName(data.full_name || "");
        setTitle(data.title || "");
        setPhone(data.phone || "");
        setLocation(data.address || "");
        setSkills(data.skills || []);
        setProfileImagePreview(data.profile_pic_url || "");
        setEducation(data.education || []);
        setBio(data.bio || "");
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  fetchProfile();
}, []);


  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfileImagePreview(user.profilePicture || null);
      
      // Additional fields that would come from a more complete user profile
      setTitle(user.title || '');
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setWebsite(user.website || '');
      setSkills(user.skills || []);
    }
  }, [user]);

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Add a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Handle form submission
//  const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   const token = localStorage.getItem("access_token");
//   const formData = new FormData();

//   formData.append("full_name", name);
//   formData.append("title", title);
//   formData.append("bio", bio);
//   formData.append("email", email);
//   formData.append("phone", phone);
//   formData.append("address", location);
//   formData.append("website", website);
//   formData.append("skills", JSON.stringify(skills));
//   formData.append("education", JSON.stringify(education));
   
//   if (profileImage) {
//     formData.append("profile_image", profileImage);
//   }

//   try {
//     const res = await fetch("http://localhost:8000/api/job-seeker/profile", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const data = await res.json();

//     if (res.ok) {
//       toast({
//         title: "Profile Updated",
//         description: "Your profile was saved successfully.",
//       });

//       if (data.profile_pic_url) {
//         setProfileImagePreview(data.profile_pic_url);
//       }

//       setIsEditing(false);
//     } else {
//       toast({
//         title: "Update Failed",
//         description: data.message || "Something went wrong.",
//         variant: "destructive",
//       });
//     }
//   } catch (err) {
//     console.error("Profile update error:", err);
//     toast({
//       title: "Error",
//       description: "Could not connect to server.",
//       variant: "destructive",
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const success = await updateProfile({
    name,
    title,
    bio,
    email,
    phone,
    location,
    website,
    skills,
    education,
    profilePicture: profileImagePreview || undefined,

  });

  if (success) {
    toast({
      title: "Profile Updated",
      description: "Your profile was saved successfully.",
    });
    setIsEditing(false);
  } else {
    toast({
      title: "Update Failed",
      description: "Something went wrong while saving.",
      variant: "destructive",
    });
  }

  setIsSubmitting(false);
};


  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return <div className="pt-32 pb-20 min-h-screen container mx-auto px-4 text-center">Loading profile...</div>;
  }

  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel Editing
            </Button>
          )}
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            {isEditing ? (
              // Edit Profile Form
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
                      <div className="flex flex-col items-center">
                        <div 
                          onClick={() => document.getElementById('profile-pic-input')?.click()}
                          className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#F6C500] transition-colors"
                        >
                          {profileImagePreview ? (
                            <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <Avatar className="w-full h-full">
                              <AvatarFallback>{getUserInitials()}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <input
                          id="profile-pic-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <button
                          type="button"
                          className="mt-2 text-sm text-[#F6C500] hover:underline"
                          onClick={() => document.getElementById('profile-pic-input')?.click()}
                        >
                          Change photo
                        </button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="title">Professional Title</Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Software Engineer, Student"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <div className="flex mt-2 mb-2">
                        <Input
                          id="skills"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          className="mr-2"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddSkill}
                          style={{ backgroundColor: "#F6C500", color: "#000000" }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center"
                          >
                            {skill}
                            <button
                              type="button"
                              className="ml-2 text-gray-500 hover:text-gray-700"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        {skills.length === 0 && (
                          <p className="text-gray-500 text-sm italic">Add your skills to help employers find you</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#F6C500", color: "#000000" }}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>

                  </CardFooter>
                </Card>
              </form>
            ) : (
              // View Profile
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="w-32 h-32 border-4 border-[#F6C500]">
                    <AvatarImage src={profileImagePreview || undefined} />
                    <AvatarFallback className="text-3xl">{getUserInitials()}</AvatarFallback>
                    </Avatar>

                    <div>
                      <CardTitle className="text-2xl">{name}</CardTitle>
                      <CardDescription className="text-lg">{title || 'No title set'}</CardDescription>
                      <div className="mt-2 text-sm text-gray-500">{user.role === 'student' ? 'Student/Job Seeker' : user.role}</div>
                      {user.role === 'student' && (
                        <div className="mt-2">
                          <span className="inline-block bg-[#FFFBEA] text-[#F6C500] border border-[#F6C500] text-xs font-semibold px-2.5 py-0.5 rounded">
                            Open to work
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">
                      {bio ? bio : "No bio added yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-600">Full Name</h4>
                    <p>{fullName || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-600">Title</h4>
                    <p>{title || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-600">Email</h4>
                    <p>{email || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-600">Phone</h4>
                    <p>{phone || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-600">Address</h4>
                    <p>{location || "N/A"}</p>
                  </div>
                </div>

                  
                  <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-gray-600">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No skills added</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                <h4 className="font-semibold mb-2 text-gray-600">Education</h4>
                {education.length > 0 ? (
                  <ul className="space-y-2">
                    {education.map((edu, index) => (
                      <li
                        key={index}
                        className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200"
                      >
                        <p className="font-medium">{edu.degree} @ {edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          {edu.yearStart} - {edu.yearEnd === "present" ? "Present" : edu.yearEnd}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-500">No education history added</p>
                )}
              </div>


                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Type */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Type</h3>
                  <div className="flex items-center p-4 bg-[#FFFAE6] rounded-lg border border-[#F6C500]">
                    <div className="mr-4">
                      <div className="w-12 h-12 rounded-full bg-[#FFF3BF] flex items-center justify-center">
                        <span className="text-2xl">
                          {user.role === "student" || user.role === "job_seeker"
                            ? "🎓"
                            : user.role === "employer"
                            ? "🏢"
                            : "🛡️"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {user.role === "student" || user.role === "job_seeker"
                          ? "Student / Job Seeker"
                          : user.role === "employer"
                          ? "Employer"
                          : "Administrator"}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.role === "student" || user.role === "job_seeker"
                          ? "You can apply to jobs and build your resume."
                          : user.role === "employer"
                          ? "You can post jobs and view applicants."
                          : "You have full administrative privileges."}
                      </p>
                    </div>
                  </div>
                </div>


                
                {/* Password Change */}
                {/* Password Change */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div className="relative">
                          <Label>Current Password</Label>
                          <Input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowCurrent(!showCurrent)}
                          >
                            <i className={`fas fa-eye${showCurrent ? '-slash' : ''}`}></i>
                          </button>
                        </div>

                    {/* New Password */}
                    <div className="relative">
                      <Label>New Password</Label>
                      <Input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="pr-10"
                      />
                      <div className="mt-2 text-xs space-y-1">
                        <div className="text-gray-500 mb-1">Password requirements:</div>
                        <div className={`flex items-center ${passwordValidation.length ? 'text-green-500' : 'text-gray-400'}`}>
                          <i className={`fas fa-${passwordValidation.length ? 'check' : 'times'} mr-2`}></i>
                          At least 8 characters
                        </div>
                        <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-500' : 'text-gray-400'}`}>
                          <i className={`fas fa-${passwordValidation.lowercase ? 'check' : 'times'} mr-2`}></i>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                          <i className={`fas fa-${passwordValidation.uppercase ? 'check' : 'times'} mr-2`}></i>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center ${passwordValidation.symbol ? 'text-green-500' : 'text-gray-400'}`}>
                          <i className={`fas fa-${passwordValidation.symbol ? 'check' : 'times'} mr-2`}></i>
                          One symbol
                        </div>
                        {passwordError && <div className="text-red-500 mt-1">{passwordError}</div>}
                      </div>

                      <button
                        type="button"
                        className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNew(!showNew)}
                      >
                        <i className={`fas fa-eye${showNew ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    {/* Confirm New Password */}
                    <div className="relative">
                      <Label>Confirm New Password</Label>
                      <Input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        <i className={`fas fa-eye${showConfirm ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                
                {/* Notification Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notification Settings</h3>
                  <div className="text-gray-500">
                    Notification settings would appear here in a real application.
                  </div>
                </div>
                
                {/* Delete Account */}
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <Button 
                  variant="destructive"
                  onClick={async () => {
                    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

                    if (!confirmed) return;

                    const token = localStorage.getItem("access_token");

                    try {
                      const res = await fetch(apiUrl("/api/delete-account"), {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      const data = await res.json();

                      if (res.ok) {
                        toast({
                          title: "Account Deleted",
                          description: "Your account has been successfully removed.",
                        });

                        localStorage.removeItem("access_token");
                        navigate("/login");
                      } else {
                        toast({
                          title: "Deletion Failed",
                          description: data.message || "Something went wrong.",
                          variant: "destructive",
                        });
                      }
                    } catch (err) {
                      toast({
                        title: "Network Error",
                        description: "Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Delete Account
                </Button>

                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;