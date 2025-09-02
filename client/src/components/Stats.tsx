import { useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Stats Component
 * 
 * Displays key metrics about the platform
 * Uses animation to reveal stats as user scrolls down
 */
const Stats = () => {
  const { ref: statsRef } = useScrollAnimation();
  const statsItems = useRef<(HTMLDivElement | null)[]>([]);

  // Stats data
  const stats = [
    { value: "1200+", label: "Active Jobs" },
    { value: "500+", label: "Companies" },
    { value: "10K+", label: "Job Seekers" },
    { value: "85%", label: "Success Rate" }
  ];

  return (
    <section className="py-16 bg-white" ref={statsRef}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="p-4 opacity-0 fade-in-up"
              ref={el => statsItems.current[index] = el}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl font-bold text-[#F6C500] mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
