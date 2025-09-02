import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import logo from '@/assets/logo.svg';

/**
 * Employer Registration - Completion Page
 * 
 * Final page shown after employer completes the registration process
 * Shows success message and offers next steps
 */
const Complete = () => {
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

        {/* Progress indicator */}
        <div className="flex items-center mb-8">
          <div className="mr-3 text-sm font-medium text-gray-400">Setup Progress</div>
          <div className="flex-grow">
            <div className="h-2 bg-[#F6C500] rounded-full"></div>
          </div>
          <div className="ml-3 text-sm font-medium text-[#F6C500]">
            100% Completed
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-[#EDF2FF] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-[#F6C500] text-3xl">✓</span>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">
              🎉 Congratulations, Your profile is 100% complete!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Donec hendrerit, ante mattis pellentesque eleifend, tortor urna 
              malesuada ante, eget aliquam nulla augue hendrerit ligula. Nunc 
              mauris arcu, mattis sed sem vitae.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="h-12 px-8"
              variant="outline"
              asChild
            >
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            
            <Button
              className="h-12 px-8"
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              asChild
            >
              <Link href="/post-job">Post Job <i className="fas fa-arrow-right ml-2"></i></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complete;