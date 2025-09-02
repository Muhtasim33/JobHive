import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import JobListings from "@/components/JobListings";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Jobs Page Component
 * 
 * Dedicated page for job listings with enhanced filtering capabilities
 * Features comprehensive search and filters in a sidebar layout
 * Allows filtering by job type, skills, location, and industry
 */
const JobsPage = () => {
  const [filters, setFilters] = useState({
    location: "all_locations",
    jobType: "all_types",
    experience: "all_levels",
    industry: "all_industries",
    search: "",
    skills: [] as string[]
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { isAuthenticated } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Set page title
  useEffect(() => {
    document.title = "Explore Jobs - JobHive";
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle skill selection
  const handleSkillChange = (skill: string, checked: boolean) => {
    setSelectedSkills(prev => {
      if (checked) {
        return [...prev, skill];
      } else {
        return prev.filter(s => s !== skill);
      }
    });
  };

  // Apply skills filter
  useEffect(() => {
    handleFilterChange("skills", selectedSkills);
  }, [selectedSkills]);

  // Common tech skills
  const commonSkills = [
    "JavaScript", "React", "AI", "ML", "Node.js", "Python",
    "Java", "HTML/CSS", "SQL", "AWS", "Git", "Docker",
    "TypeScript", "Angular", "Vue.js", "UI/UX", "PHP"
  ];

  // Industry options
  const industries = [
    { value: "all_industries", label: "All Industries" },
    { value: "tech", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "marketing", label: "Marketing" },
    { value: "engineering", label: "Engineering" },
    { value: "retail", label: "Retail" },
    { value: "hospitality", label: "Hospitality" }
  ];

  return (
    <main className="py-20 px-4 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-10 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Job</h1>
          <p className="text-lg max-w-2xl">
            Explore our extensive list of jobs and internships tailored for students and fresh graduates.
            Use the filters to narrow down your search.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 w-full">
            <Card className="sticky top-24 fade-in-up">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Filter Results</h2>
                
                {/* Search */}
                <div className="mb-6">
                  <Label htmlFor="search" className="mb-2 block">Search</Label>
                  <Input 
                    id="search" 
                    type="text" 
                    placeholder="Keywords, Job Title, Company..." 
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* Location */}
                <div className="mb-6">
                  <Label htmlFor="location" className="mb-2 block">Location</Label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_locations">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="dhaka">Dhaka, Bangladesh</SelectItem>
                      <SelectItem value="amman">Amman, Jordan</SelectItem>
                      <SelectItem value="cairo">Cairo, Egypt</SelectItem>
                      <SelectItem value="dubai">Dubai, UAE</SelectItem>
                      <SelectItem value="riyadh">Riyadh, Saudi Arabia</SelectItem>
                      <SelectItem value="istanbul">Istanbul, Turkey</SelectItem>
                      <SelectItem value="bengaluru">Bengaluru, India</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad, India</SelectItem>
                      <SelectItem value="singapore">Singapore</SelectItem>
                      <SelectItem value="kuala_lumpur">Kuala Lumpur, Malaysia</SelectItem>
                      <SelectItem value="jakarta">Jakarta, Indonesia</SelectItem>
                      <SelectItem value="hanoi">Hanoi, Vietnam</SelectItem>
                      <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                      <SelectItem value="seoul">Seoul, South Korea</SelectItem>
                      <SelectItem value="shenzhen">Shenzhen, China</SelectItem>
                      <SelectItem value="hong_kong">Hong Kong</SelectItem>
                      <SelectItem value="berlin">Berlin, Germany</SelectItem>
                      <SelectItem value="london">London, UK</SelectItem>
                      <SelectItem value="toronto">Toronto, Canada</SelectItem>
                      <SelectItem value="san_francisco">San Francisco, USA</SelectItem>
                      <SelectItem value="new_york">New York, USA</SelectItem>
                      <SelectItem value="austin">Austin, USA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Job Type */}
                <div className="mb-6">
                  <Label htmlFor="job-type" className="mb-2 block">Job Type</Label>
                  <Select value={filters.jobType} onValueChange={(value) => handleFilterChange("jobType", value)}>
                    <SelectTrigger id="job-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_types">All Types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Experience */}
                <div className="mb-6">
                  <Label htmlFor="experience" className="mb-2 block">Experience</Label>
                  <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_levels">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="1-2">1-2 Years</SelectItem>
                      <SelectItem value="3+">3+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Industry */}
                <div className="mb-6">
                  <Label htmlFor="industry" className="mb-2 block">Industry</Label>
                  <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Skills */}
                <div className="mb-6">
                  <Label className="mb-2 block">Skills</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {commonSkills.map(skill => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill}`} 
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => handleSkillChange(skill, checked === true)}
                        />
                        <label 
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="mb-6">
                    <Label className="mb-2 block">Selected Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="flex items-center gap-1 py-1"
                        >
                          {skill}
                          <button
                            onClick={() => handleSkillChange(skill, false)}
                            className="w-4 h-4 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full border-[#F6C500] text-black hover:bg-[#FFFBEA]"
                  onClick={() => {
                    setFilters({
                      location: "all_locations",
                      jobType: "all_types",
                      experience: "all_levels",
                      industry: "all_industries",
                      search: "",
                      skills: []
                    });
                    setSelectedSkills([]);
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Job Listings */}
          <div className="lg:w-3/4 w-full">
            <JobListings 
              filters={filters} 
              fullPage={true} 
              onApplyClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Authentication Required",
                    description: "Please log in to apply for jobs",
                    variant: "default"
                  });
                  navigate("/login");
                  return false; // Prevent further action
                }
                return true; // Allow action to continue
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobsPage;
