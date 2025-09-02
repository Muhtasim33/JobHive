import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Features Component
 * 
 * Showcases the key features and benefits of JobHive
 * Uses a grid layout with icons and descriptions
 */
const Features = () => {
  const { ref: featuresRef } = useScrollAnimation();
  const headingRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Features data
  const features = [
    {
      icon: "fa-bullseye",
      title: "Personalized Recommendations",
      description: "Get job recommendations tailored to your skills, interests, and career goals."
    },
    {
      icon: "fa-file-alt",
      title: "Resume Builder",
      description: "Create professional resumes with our easy-to-use builder designed for entry-level positions."
    },
    {
      icon: "fa-comments",
      title: "Direct Messaging",
      description: "Connect directly with employers through our integrated messaging system."
    },
    {
      icon: "fa-filter",
      title: "Advanced Filters",
      description: "Find the perfect job with filters for skills, location, job type, and more."
    },
    {
      icon: "fa-chart-line",
      title: "Job Tracking",
      description: "Keep track of your applications and interviews with our clean dashboard."
    },
    {
      icon: "fa-graduation-cap",
      title: "Student Friendly",
      description: "Designed specifically for students and fresh graduates entering the job market."
    }
  ];

  return (
    <section className="py-16 bg-[#F8F9FA]" ref={featuresRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 opacity-0 fade-in-up" ref={headingRef}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose JobHive?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We understand the unique challenges faced by students and fresh graduates in finding the right opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 opacity-0 fade-in-up"
              ref={el => featureRefs.current[index] = el}
              style={{ animationDelay: `${index % 3 * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#FFFBEA] p-3 rounded-full mr-4">
                  <i className={`fas ${feature.icon} text-[#F6C500] text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
