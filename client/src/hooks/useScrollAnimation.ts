import { useEffect, useRef } from "react";

/**
 * useScrollAnimation Hook
 * 
 * Custom hook to handle scroll-based animations
 * Monitors elements and applies animation classes when they come into view
 * 
 * @returns Object with ref to be applied to target element
 */
export const useScrollAnimation = () => {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Function to check if element is in viewport
    const isInViewport = (element: HTMLElement, offset: number = 100) => {
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight - offset) &&
        rect.bottom >= offset
      );
    };

    // Function to handle scroll and animate elements
    const handleScroll = () => {
      if (!ref.current) return;
      
      // Find all elements with opacity:0 within the container
      const elements = ref.current.querySelectorAll(".opacity-0");
      
      elements.forEach((element) => {
        if (isInViewport(element as HTMLElement)) {
          // If in viewport and not already animated, make visible
          if ((element as HTMLElement).style.opacity !== "1") {
            (element as HTMLElement).style.opacity = "1";
          }
        }
      });
    };
    
    // Set up the scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Check immediately in case elements are already in view
    handleScroll();
    
    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return { ref };
};

export default useScrollAnimation;
