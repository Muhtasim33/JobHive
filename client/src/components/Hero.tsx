import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImage from "@/assets/hero.png";

/**
 * Hero Component
 * 
 * Main landing banner showcasing the core value proposition
 * Implements a responsive design that adapts to different screen sizes
 */
const Hero = () => {
  const { ref: heroRef } = useScrollAnimation();
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // No animations per user request

  return (
    <section className="relative bg-[#FFFBEA] py-12 lg:py-20 overflow-hidden pt-32" ref={heroRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Column - Text Content */}
          <div 
            className="w-full lg:w-1/2 mb-10 lg:mb-0 z-10" 
            ref={heroContentRef}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 relative">
              <span className="block">Sweet opportunities</span>
              <span className="block text-[#F6C500]">
                for the NewBees!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
              Find the perfect job opportunities tailored for students and fresh graduates. 
              Start building your career today!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="btn-pulse rounded-full"
                style={{ backgroundColor: "#F6C500", color: "#000000" }}
                asChild
              >
                <Link href="/jobs">Explore Jobs</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-[#F6C500] text-black rounded-full"
                asChild
              >
                <Link href="/post-job">Post a Job</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Column - Hero Image */}
          <div 
            className="w-full lg:w-1/2 relative" 
            ref={heroImageRef}
          >
            <img 
              src={heroImage}
              alt="Young professional looking for job opportunities" 
              className="rounded-lg shadow-xl mx-auto lg:ml-auto w-4/5 translate-y-4 translate-x-12" 
            /> 
          </div>
        </div>
      </div>
      
      {/* Background Hexagon Pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <div className="w-full h-full" style={{ backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSIxMDAiPgogIDxwYXRoIGZpbGw9IiNGNkM1MDAiIGQ9Ik00MyAwbDQzIDI1djUwbC00MyAyNUwwIDc1VjI1eiI+PC9wYXRoPgo8L3N2Zz4=")`, backgroundRepeat: "repeat" }}></div>
      </div>
    </section>
  );
};

export default Hero;
