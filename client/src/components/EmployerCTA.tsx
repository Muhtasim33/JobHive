import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Employer CTA Component
 * 
 * Call-to-action section targeting employers
 * Features a compelling message to post jobs and connect with students/graduates
 */
const EmployerCTA = () => {
  const { ref: ctaRef } = useScrollAnimation();
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-[#F6C500] relative overflow-hidden" ref={ctaRef}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div 
            className="w-full lg:w-2/3 mb-10 lg:mb-0 opacity-0 fade-in-up"
            ref={contentRef}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Are You an Employer?</h2>
            <p className="text-lg text-black opacity-80 mb-8 max-w-xl">
              Connect with qualified students and fresh graduates who are eager to bring fresh perspectives and up-to-date knowledge to your company.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all duration-200"
                asChild
              >
                <Link href="/post-job">Post a Job</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-black bg-transparent text-black rounded-full font-bold hover:bg-[#FFFBEA] transition-all duration-200"
                asChild
              >
                <Link href="/register">Learn More</Link>
              </Button>
            </div>
          </div>
          
          <div 
            className="w-full lg:w-1/3 opacity-0 fade-in-up animate-delay-200"
            ref={imageRef}
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Professional workplace environment" 
              className="rounded-lg shadow-xl mx-auto float-animation" 
            />
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="w-full h-full" style={{ backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSIxMDAiPgogIDxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik00MyAwbDQzIDI1djUwbC00MyAyNUwwIDc1VjI1eiI+PC9wYXRoPgo8L3N2Zz4=")`, backgroundRepeat: "repeat" }}></div>
      </div>
    </section>
  );
};

export default EmployerCTA;
