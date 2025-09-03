import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, useLocation } from 'wouter';
import RegistrationProgress from '@/components/auth/RegistrationProgress';
import logo from '@/assets/logo.svg';
import { apiUrl, imageUrl } from '@/config';

const CompanyInfo = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const userId = localStorage.getItem("user_id") || "";

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

  console.log(`${type} uploaded:`, data.url);
  return data.url;
};





  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
      try {
        const url = await uploadImage(file, 'logo');
        console.log('Logo uploaded:', url);
      } catch (err) {
        console.error(err);
        alert('Failed to upload logo');
      }
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerPreview(URL.createObjectURL(file));
      try {
        const url = await uploadImage(file, 'banner');
        console.log('Banner uploaded:', url);
      } catch (err) {
        console.error(err);
        alert('Failed to upload banner');
      }
    }
  };

  const registrationSteps = [
    { icon: <i className="fas fa-building"></i>, label: "Company Info" },
    { icon: <i className="fas fa-info-circle"></i>, label: "Founding Info" },
    { icon: <i className="fas fa-share-alt"></i>, label: "Social Media Profile" },
    { icon: <i className="fas fa-phone"></i>, label: "Contact" },
  ];

  const handleNext = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const storedUser = localStorage.getItem("jobhive_user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId) {
      alert("User ID not found.");
      return;
    }

    const res = await fetch(apiUrl("/api/employer/company-info"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        company_name: companyName,
        company_desc: companyDescription,
      }),
    });

    if (!res.ok) throw new Error("Failed to save company info");
    navigate("/register/employer/founding-info");
  } catch (err) {
    console.error(err);
    alert("Failed to save. Please try again.");
  }
};


  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            {/* <img src={logo} alt="JobHive Logo" className="w-8 h-8" /> */}
            {/* <span className="text-xl font-bold">JobHive</span> */}
          </Link>
        </div>

        <RegistrationProgress currentStep={0} steps={registrationSteps} />

        <form onSubmit={handleNext} className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Logo & Banner Image</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-medium mb-2">Logo</h2>
              <p className="text-sm text-gray-500 mb-4">Upload document</p>
              <div
                className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center h-44 ${logoPreview ? 'border-[#F6C500]' : 'border-gray-200'}`}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="h-full object-contain" />
                ) : (
                  <>
                    <div className="mb-4 text-gray-400">
                      <i className="fas fa-cloud-upload-alt text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Browse photo or drop here</p>
                    <p className="text-xs text-gray-400 text-center mt-2">A photo larger than 400 pixels works best. Max photo size 1 MB.</p>
                  </>
                )}
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Banner Image</h2>
              <p className="text-sm text-gray-500 mb-4">Banner Image</p>
              <div
                className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center h-44 ${bannerPreview ? 'border-[#F6C500]' : 'border-gray-200'}`}
                onClick={() => document.getElementById('banner-upload')?.click()}
              >
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner Preview" className="h-full object-contain" />
                ) : (
                  <>
                    <div className="mb-4 text-gray-400">
                      <i className="fas fa-cloud-upload-alt text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Browse photo or drop here</p>
                    <p className="text-xs text-gray-400 text-center mt-2">Banner image optimal dimension 1240x400. Supported format JPEG, PNG. Max photo size 5 MB.</p>
                  </>
                )}
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="company-name" className="block font-medium mb-2">Company name</label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="mb-12">
            <label htmlFor="about" className="block font-medium mb-2">About Us</label>
            <Textarea
              id="about"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Write down about your company here. Let the candidate know who we are..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-40 h-12 font-medium"
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
            >
              Save & Next <i className="fas fa-arrow-right ml-1"></i>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfo;
