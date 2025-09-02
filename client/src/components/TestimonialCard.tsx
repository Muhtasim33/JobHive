import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Testimonial Card Component
 * 
 * Displays a single testimonial with user information, quote, and rating
 * 
 * @param {Object} props - Component props
 * @param {Object} props.testimonial - Testimonial data object
 * @param {number} props.animationDelay - Delay for animation in milliseconds
 */
const TestimonialCard = ({ testimonial, animationDelay = 0 }: { testimonial: any, animationDelay?: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Helper function to render stars for ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    return stars;
  };

  return (
    <Card className="bg-white shadow-md p-6 opacity-0 fade-in-up" ref={cardRef} style={{ animationDelay: `${animationDelay}ms` }}>
      <CardContent className="p-0">
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.image} 
            alt={`Testimonial from ${testimonial.name}`} 
            className="w-16 h-16 rounded-full object-cover mr-4" 
          />
          <div>
            <h4 className="font-bold text-lg">{testimonial.name}</h4>
            <p className="text-gray-600 text-sm">{testimonial.role}</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{testimonial.quote}</p>
        
        <div className="flex text-[#F6C500]">
          {renderStars(testimonial.rating)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
