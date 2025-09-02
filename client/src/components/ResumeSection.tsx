import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Resume Section Component
 * 
 * Promotes the resume building tool with features and benefits
 * Includes a call-to-action to the full resume builder page
 */
const ResumeSection = () => {
  const { ref: resumeRef } = useScrollAnimation();
  const resumeImageRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  // Resume builder benefits
  const benefits = [
    "Professional templates tailored for entry-level positions",
    "Expert tips and guidance for each section",
    "AI-powered suggestions to improve your content",
    "Export to PDF, Word, or directly share with employers"
  ];

  return (
    <section className="py-16 bg-[#FFFBEA]" ref={resumeRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Resume UI Preview */}
          <div 
            className="w-full lg:w-1/2 mb-10 lg:mb-0 opacity-0 fade-in-up" 
            ref={resumeImageRef}
          >
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional resume builder interface" 
              className="rounded-lg shadow-xl mx-auto" 
            />
          </div>
          
          {/* Right side - Text content */}
          <div 
            className="w-full lg:w-1/2 lg:pl-12 opacity-0 fade-in-up animate-delay-200"
            ref={resumeContentRef}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Professional Resume</h2>
            <p className="text-gray-700 mb-6">
              Our resume builder is designed specifically for students and fresh graduates. Highlight your skills, education, and projects in a professional format that stands out to employers.
            </p>
            
            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F6C500] flex items-center justify-center mr-3 mt-1">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="btn-pulse rounded-full"
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              asChild
            >
              <Link href="/resume-builder">Build Your Resume</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
