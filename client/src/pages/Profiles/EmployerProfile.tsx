import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiUrl, imageUrl } from '@/config';

const platformIcons = {
  facebook: <FaFacebook className="mr-2" />, 
  twitter: <FaTwitter className="mr-2" />, 
  linkedin: <FaLinkedin className="mr-2" />, 
  instagram: <FaInstagram className="mr-2" />, 
  website: <FaGlobe className="mr-2" />,
};

const EmployerProfile: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  if (!user) {
  return <div className="pt-32 text-center">Loading user data...</div>;
}

  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ length: false, lowercase: false, uppercase: false, symbol: false });
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const validatePassword = (password: string) => {
  setPasswordValidation({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });
};

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  const employeeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'];
  const fundingOptions = ['bootstrapped', 'seed', 'series-a', 'series-b', 'series-c-plus', 'public'];
  const industryOptions = ['technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing', 'hospitality', 'media', 'transportation', 'other'];
  const uploadImage = async (file: File, type: 'logo' | 'banner') => {
    const storedUser = localStorage.getItem('jobhive_user');
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId) {
      alert('User ID not found. Are you logged in?');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    formData.append('image_type', type);

    const res = await fetch(apiUrl('/api/employer/upload-image'), {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Upload error:', data.error);
      throw new Error(data.error);
    }

    return data.url;
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0], key as 'logo' | 'banner');
        setFormData({ ...formData, [`${key}_url`]: url });
      } catch (err) {
        console.error(err);
        alert(`Failed to upload ${key}`);
      }
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('access_token');
    fetch(apiUrl('/api/employer/profile'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const parsedLinks = typeof data.social_links === 'string' ? JSON.parse(data.social_links) : data.social_links;
        const processedData = { ...data, social_links: parsedLinks };
        setCompanyInfo(processedData);
        setFormData(processedData);
      })
      .catch((err) => console.error('Failed to load employer profile', err));
  }, [isAuthenticated]);

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

    const handleSave = async () => {
    const storedUser = localStorage.getItem("jobhive_user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    if (!userId) return alert("User not found");

    const token = localStorage.getItem('access_token');

    try {
      await fetch(apiUrl('/api/employer/company-info'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          company_name: formData.company_name,
          company_desc: formData.company_desc,
        })
      });

      await fetch(apiUrl('/api/employer/founding-info'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          founded_year: formData.founded_year,
          employees: formData.employees,
          funding: formData.funding,
          industry: formData.industry,
        })
      });

      await fetch(apiUrl('/api/employer/contact-info'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
        })
      });

      if (formData.social_links) {
        const linksArray = Object.entries(formData.social_links).map(([platform, url]) => ({ platform, url }));
        await fetch(apiUrl('/api/employer/social-media'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, social_links: linksArray })
        });
      }

      setCompanyInfo(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
      alert("Failed to save changes.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(apiUrl("/api/delete-account"), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Account Deleted", description: "Your account has been successfully removed." });
        localStorage.removeItem("access_token");
        const [, setLocation] = useLocation();
        setLocation("/login");
      } else {
        toast({ title: "Deletion Failed", description: data.message || "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Please try again.", variant: "destructive" });
    }
  };

  if (!companyInfo) return <div className="pt-32 text-center">Loading company profile...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Employer Profile</h1>
          <Button style={{ backgroundColor: '#F6C500', color: '#000000' }} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white border p-1 rounded-lg mb-4">
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
  <Card>
    {isEditing ? (
      <input
        type="file"
        accept="image/*"
        className="w-full p-2"
        onChange={(e) => handleFileChange(e, 'banner')}
      />
    ) : (
      companyInfo.banner_url && (
        <img
          src={imageUrl(companyInfo.banner_url)}
          alt="Company Banner"
          className="w-full h-48 object-cover rounded-t"
        />
      )
    )}

    <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
      <Avatar className="w-32 h-32 border-4 border-[#F6C500]">
        <AvatarImage src={imageUrl(companyInfo.logo_url)} />
        <AvatarFallback>{formData.company_name?.charAt(0).toUpperCase() || 'C'}</AvatarFallback>
      </Avatar>
      <div>
        {isEditing ? (
          <>
            <input
              className="text-xl font-bold mb-2"
              value={formData.company_name || ''}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="border rounded w-full p-2 mb-2"
              onChange={(e) => handleFileChange(e, 'logo')}
            />
            <textarea
              className="border rounded w-full p-2"
              placeholder="Company Description"
              value={formData.company_desc || ''}
              onChange={(e) => setFormData({ ...formData, company_desc: e.target.value })}
            />
          </>
        ) : (
          <>
            <CardTitle className="text-2xl">{companyInfo.company_name}</CardTitle>
            <p className="text-gray-600">{companyInfo.industry || 'Industry not specified'}</p>
            <p className="text-sm text-gray-500 mt-1">{companyInfo.company_desc || 'No description provided.'}</p>
          </>
        )}
      </div>
    </CardHeader>

    <CardContent className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["founded_year", "employees", "funding", "industry", "address", "phone", "email"].map((field) => (
          <div key={field}>
            <h4 className="font-semibold text-gray-600">{field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</h4>
            {isEditing ? (
              (field === 'founded_year' || field === 'employees' || field === 'funding' || field === 'industry') ? (
                <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${field}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field === 'founded_year' ? yearOptions : field === 'employees' ? employeeOptions : field === 'funding' ? fundingOptions : industryOptions).map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <input
                  className="border rounded w-full p-2"
                  value={formData[field] || ''}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              )
            ) : (
              <p>{companyInfo[field] || 'N/A'}</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-semibold text-gray-600 mb-2">Social Media</h4>
        {isEditing ? (
          Object.entries(formData.social_links || {}).map(([platform, url]) => (
            <div key={platform} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">{platform}</label>
              <input
                className="border rounded w-full p-2"
                value={url as string}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: {
                    ...formData.social_links,
                    [platform]: e.target.value
                  }
                })}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(companyInfo.social_links || {}).map(([platform, url]) => (
              <a
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                {(platformIcons as Record<string, JSX.Element>)[platform.toLowerCase()] || <FaGlobe className="mr-2" />}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <Button onClick={handleSave} className="mt-4">
          Save Changes
        </Button>
      )}
    </CardContent>
  </Card>
</TabsContent>


          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Type</h3>
                  <div className="flex items-center p-4 bg-[#FFFAE6] rounded-lg border border-[#F6C500]">
                    <div className="mr-4">
                      <div className="w-12 h-12 rounded-full bg-[#FFF3BF] flex items-center justify-center">
                        <span className="text-2xl">{user.role === "student" || user.role === "job_seeker" ? "🎓" : user.role === "employer" ? "🏢" : "🛡️"}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {user.role === "student" || user.role === "job_seeker" ? "Student / Job Seeker" : user.role === "employer" ? "Employer" : "Administrator"}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.role === "student" || user.role === "job_seeker" ? "You can apply to jobs and build your resume." : user.role === "employer" ? "You can post jobs and view applicants." : "You have full administrative privileges."}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Label>Current Password</Label>
                      <Input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="pr-10" />
                      <button type="button" className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500" onClick={() => setShowCurrent(!showCurrent)}>
                        <i className={`fas fa-eye${showCurrent ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    <div className="relative">
                      <Label>New Password</Label>
                      <Input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewPassword(value);
                            validatePassword(value);
                          }}
                        />

                      <div className="mt-2 text-xs space-y-1">
                        <div className="text-gray-500 mb-1">Password requirements:</div>
                        {Object.entries(passwordValidation).map(([key, valid]) => (
                          <div key={key} className={`flex items-center ${valid ? 'text-green-500' : 'text-gray-400'}`}>
                            <i className={`fas fa-${valid ? 'check' : 'times'} mr-2`}></i>
                            {key === 'length' ? 'At least 8 characters' : key === 'lowercase' ? 'One lowercase letter' : key === 'uppercase' ? 'One uppercase letter' : 'One symbol'}
                          </div>
                        ))}
                        {passwordError && <div className="text-red-500 mt-1">{passwordError}</div>}
                      </div>
                      <button type="button" className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500" onClick={() => setShowNew(!showNew)}>
                        <i className={`fas fa-eye${showNew ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    <div className="relative">
                      <Label>Confirm New Password</Label>
                      <Input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" className="pr-10" />
                      <button type="button" className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500" onClick={() => setShowConfirm(!showConfirm)}>
                        <i className={`fas fa-eye${showConfirm ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    <Button onClick={handleChangePassword} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerProfile;

