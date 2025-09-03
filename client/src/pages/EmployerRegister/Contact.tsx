import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useLocation } from 'wouter';
import RegistrationProgress from '@/components/auth/RegistrationProgress';
import logo from '@/assets/logo.svg';
import { apiUrl } from '@/config';

/**
 * Employer Registration - Contact Step
 * 
 * Final step in the employer registration process
 * Collects contact information and location details
 */
const Contact = () => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+962');
  const [email, setEmail] = useState('');
  const [, navigate] = useLocation();

  // Country codes for dropdown
  const countryCodes = [
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
];


  // Progress bar steps
  const registrationSteps = [
    { icon: <i className="fas fa-building"></i>, label: "Company Info" },
    { icon: <i className="fas fa-info-circle"></i>, label: "Founding Info" },
    { icon: <i className="fas fa-share-alt"></i>, label: "Social Media Profile" },
    { icon: <i className="fas fa-phone"></i>, label: "Contact" },
  ];

  const handleFinish = async (e: React.FormEvent) => {
  e.preventDefault();

  const storedUser = localStorage.getItem("jobhive_user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  if (!userId) {
    alert("User ID not found. Are you logged in?");
    return;
  }

  try {
    const res = await fetch(apiUrl("/api/employer/contact-info"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        address,
        phone: `${countryCode}${phone}`,
        email,
      }),
    });

    if (!res.ok) throw new Error("Failed to save contact info");

    navigate('/register/employer/complete');
  } catch (err) {
    console.error(err);
    alert("Failed to save. Please try again.");
  }
};


  const handlePrevious = () => {
    navigate('/register/employer/social-media');
  };

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
        <RegistrationProgress currentStep={3} steps={registrationSteps} />

        <form onSubmit={handleFinish} className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Contact</h1>

          {/* Map Location */}
          <div className="mb-8">
            <label htmlFor="address" className="block font-medium mb-2">Map Location</label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your company address"
              className="h-12"
            />
          </div>

          {/* Phone */}
          <div className="mb-8">
            <label htmlFor="phone" className="block font-medium mb-2">Phone</label>
            <div className="flex">
              <div className="w-28 mr-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number..."
                className="h-12 flex-grow"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-12">
            <label htmlFor="email" className="block font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="far fa-envelope text-gray-400"></i>
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-12 pl-10"
              />
            </div>
          </div>

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
              Finish Editing <i className="fas fa-arrow-right ml-1"></i>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;