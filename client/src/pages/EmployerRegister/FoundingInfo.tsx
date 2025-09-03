import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useLocation } from 'wouter';
import RegistrationProgress from '@/components/auth/RegistrationProgress';
import logo from '@/assets/logo.svg';
import { apiUrl } from '@/config';

/**
 * Employer Registration - Founding Info Step
 * 
 * Second step in the employer registration process
 * Collects information about company founding, size, funding, etc.
 */
const FoundingInfo = () => {
  const [foundedYear, setFoundedYear] = useState('');
  const [employees, setEmployees] = useState('');
  const [funding, setFunding] = useState('');
  const [industry, setIndustry] = useState('');
  const [, navigate] = useLocation();

  // Generate year options for founded year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

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
    const res = await fetch(apiUrl("/api/employer/founding-info"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        founded_year: foundedYear,
        employees,
        funding,
        industry,
      }),
    });

    if (!res.ok) throw new Error("Failed to save founding info");

    navigate("/register/employer/social-media");
  } catch (err) {
    console.error(err);
    alert("Failed to save founding info. Please try again.");
  }
};


  const handlePrevious = () => {
    navigate('/register/employer');
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
        <RegistrationProgress currentStep={1} steps={registrationSteps} />

        <form onSubmit={handleNext} className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Founding Info</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Founded Year */}
            <div>
              <label htmlFor="founded-year" className="block font-medium mb-2">Founded Year</label>
              <Select value={foundedYear} onValueChange={setFoundedYear}>
                <SelectTrigger id="founded-year" className="h-12">
                  <SelectValue placeholder="Select founding year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Employees */}
            <div>
              <label htmlFor="employees" className="block font-medium mb-2">Number of Employees</label>
              <Select value={employees} onValueChange={setEmployees}>
                <SelectTrigger id="employees" className="h-12">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1001+">1001+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Funding */}
            <div>
              <label htmlFor="funding" className="block font-medium mb-2">Funding</label>
              <Select value={funding} onValueChange={setFunding}>
                <SelectTrigger id="funding" className="h-12">
                  <SelectValue placeholder="Select funding status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                  <SelectItem value="seed">Seed funding</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c-plus">Series C or later</SelectItem>
                  <SelectItem value="public">Public company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block font-medium mb-2">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry" className="h-12">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="media">Media & Entertainment</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
              Save & Next <i className="fas fa-arrow-right ml-1"></i>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoundingInfo;