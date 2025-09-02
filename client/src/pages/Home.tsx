import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import JobListings from "@/components/JobListings";
import ResumeSection from "@/components/ResumeSection";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

/**
 * Home Page Component
 * 
 * Main landing page for JobHive
 * Assembles various sections to create a complete landing page experience
 * Each section is a separate component to maintain modularity and reusability
 */
const Home = () => {
  const { isAuthenticated, isRole } = useUser();
  
  // Set page title
  useEffect(() => {
    document.title = "JobHive - Sweet opportunities for the NewBees!";
  }, []);

  return (
    <main>
      <Hero />
      <Stats />
      <Features />
      <JobListings />
      {/* Only show Resume Section for non-employers */}
      {(!isAuthenticated || !isRole('employer')) && (
        <ResumeSection />
      )}
    </main>
  );
};

export default Home;
