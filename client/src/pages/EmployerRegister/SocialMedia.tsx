import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useLocation } from 'wouter';
import RegistrationProgress from '@/components/auth/RegistrationProgress';
import logo from '@/assets/logo.svg';
import { apiUrl } from '@/config';

/**
 * Employer Registration - Social Media Step
 * 
 * Third step in the employer registration process
 * Collects social media profiles and website information
 */
const SocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'facebook', url: '' },
    { platform: 'twitter', url: '' },
    { platform: 'instagram', url: '' }
  ]);
  const [, navigate] = useLocation();

  // Add a new social link field
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'linkedin', url: '' }]);
  };

  // Remove a social link field
  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  // Update platform or URL for a specific social link
  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  // Progress bar steps
  const registrationSteps = [
    { icon: <i className="fas fa-building"></i>, label: "Company Info" },
    { icon: <i className="fas fa-info-circle"></i>, label: "Founding Info" },
    { icon: <i className="fas fa-share-alt"></i>, label: "Social Media Profile" },
    { icon: <i className="fas fa-phone"></i>, label: "Contact" },
  ];

  const handleNext = async (e: React.FormEvent) => {
  e.preventDefault();

  const storedUser = localStorage.getItem("jobhive_user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  if (!userId) {
    alert("User ID not found. Are you logged in?");
    return;
  }

  try {
    const res = await fetch(apiUrl("/api/employer/social-media"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        social_links: socialLinks,
      }),
    });

    if (!res.ok) throw new Error("Failed to save social media info");
    navigate("/register/employer/contact");
  } catch (err) {
    console.error(err);
    alert("Failed to save social media info. Please try again.");
  }
};


  const handlePrevious = () => {
    navigate('/register/employer/founding-info');
  };

  // Platform options with icons
  const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: <i className="fab fa-facebook text-blue-600"></i> },
    { value: 'twitter', label: 'Twitter', icon: <i className="fab fa-twitter text-blue-400"></i> },
    { value: 'instagram', label: 'Instagram', icon: <i className="fab fa-instagram text-pink-500"></i> },
    { value: 'linkedin', label: 'LinkedIn', icon: <i className="fab fa-linkedin text-blue-700"></i> },
    { value: 'youtube', label: 'YouTube', icon: <i className="fab fa-youtube text-red-600"></i> },
    { value: 'github', label: 'GitHub', icon: <i className="fab fa-github text-gray-800"></i> },
    { value: 'dribbble', label: 'Dribbble', icon: <i className="fab fa-dribbble text-pink-400"></i> },
    { value: 'behance', label: 'Behance', icon: <i className="fab fa-behance text-blue-800"></i> },
  ];

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
        <RegistrationProgress currentStep={2} steps={registrationSteps} />

        <form onSubmit={handleNext} className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Social Media Profile</h1>

          {/* Social media links */}
          <div className="space-y-4 mb-8">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-40">
                  <Select 
                    value={link.platform} 
                    onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue>
                        {platformOptions.find(option => option.value === link.platform)?.icon}
                        <span className="ml-2">
                          {platformOptions.find(option => option.value === link.platform)?.label}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.icon}
                            <span className="ml-2">{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-grow relative">
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="Profile link/url..."
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => removeSocialLink(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new social link button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 mb-12 border-dashed"
            onClick={addSocialLink}
          >
            <i className="fas fa-plus mr-2"></i> Add New Social Link
          </Button>

          {/* Footer */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-40 h-12 font-medium"
              onClick={handlePrevious}
            >
              Previous
            </Button>
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

export default SocialMedia;