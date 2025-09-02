import { useRef } from "react";
import TestimonialCard from "./TestimonialCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Testimonials Component
 * 
 * Displays success stories from students and graduates who found jobs through JobHive
 * Uses a responsive grid layout to showcase testimonials
 */
const Testimonials = () => {
  const { ref: testimonialsRef } = useScrollAnimation();
  const headingRef = useRef<HTMLDivElement>(null);
  
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Graduate",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      quote: "As a fresh graduate, I was struggling to find opportunities that matched my skills. JobHive connected me with a great entry-level developer position that aligned perfectly with my career goals.",
      rating: 5
    },
    {
      id: 2,
      name: "Ahmad Al-Najjar",
      role: "Business Administration Student",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      quote: "The resume builder tool helped me create a professional CV that highlighted my potential despite limited work experience. Got three interview calls within a week!",
      rating: 4.5
    },
    {
      id: 3,
      name: "Layla Kareem",
      role: "Engineering Graduate",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      quote: "JobHive's filtering system made it easy to find remote opportunities that matched my technical skills. I'm now working with a great team while completing my master's degree.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-white" ref={testimonialsRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 opacity-0 fade-in-up" ref={headingRef}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from students and graduates who found their dream opportunities through JobHive
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id}
              testimonial={testimonial}
              animationDelay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
