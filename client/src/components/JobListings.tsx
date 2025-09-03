import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import JobCard from "./JobCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getResumeData } from "@/utils/resumeUtils";
import { useUser } from "@/contexts/UserContext";
import { getAppliedJobs } from "@/utils/jobUtils";
import { useLocation } from "wouter";
import { API_BASE } from '../config';

export interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  job_type?: string;
  location: string;
  schedule: string;
  salary: string;
  skills: string[];
  icon: string;
  industry?: string;
  description?: string;
  postedDate?: string;
  is_applied?: boolean;
  company_name?: string;
  company_logo?: string;
  status?: string;
  
}

interface JobListingsProps {
  filters?: any;
  fullPage?: boolean;
  onApplyClick?: () => boolean;
}

const JobListings = ({ filters = {}, fullPage = false, onApplyClick }: JobListingsProps) => {
  const { ref: jobsRef } = useScrollAnimation();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isRole } = useUser();

  const safeLower = (val: string | null | undefined) =>
  (val || "").toLowerCase().trim();

const normalizeType = (val: string | null | undefined) =>
  safeLower(val).replace(/[\s_]/g, "-");



  const [localFilters, setLocalFilters] = useState({
    location: filters.location || "all_locations",
    jobType: filters.jobType || "all_types",
    experience: filters.experience || "all_levels",
    industry: filters.industry || "all_industries",
    search: filters.search || "",
    skills: filters.skills || []
  });

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();

  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    setLocalFilters({
      location: filters.location || "all_locations",
      jobType: filters.jobType || "all_types",
      experience: filters.experience || "all_levels",
      industry: filters.industry || "all_industries",
      search: filters.search || "",
      skills: filters.skills || []
    });
  }, [filters]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.id || !isRole("job_seeker")) return;

      try {
        const res = await fetch(`${API_BASE}/api/job-seeker/${user.id}/saved-jobs`);
        if (!res.ok) throw new Error("Failed to fetch saved jobs");

        const data = await res.json();
        const ids = data.map((job: any) => job.id);
        setSavedJobs(ids);
      } catch (err) {
        console.error("Error loading saved jobs:", err);
      }
    };

    fetchSavedJobs();
  }, [user]);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      const data = await response.json();

      const mapped = data.map((job: any) => {
        return {
          ...job,
          type: job.type || job.job_type || "", // ✅ Ensure 'type' is always defined
          postedDate: job.posted_date,
          skills: Array.isArray(job.skills)
            ? job.skills
            : typeof job.skills === "string"
              ? job.skills.split(",").map((s: string) => s.trim())
              : [],
        };
      });

      setAllJobs(mapped);
      setFilteredJobs(mapped);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  fetchJobs();
}, []);



  useEffect(() => {
    const fetchApplied = async () => {
      if (user?.id && isRole("job_seeker")) {
        try {
          const applied = await getAppliedJobs(Number(user.id));
          const jobIds = applied.map((job: any) => job.id);
          setAppliedJobs(jobIds);
        } catch (err) {
          console.error("Failed to load applied jobs", err);
        }
      }
    };

    fetchApplied();
  }, [user?.id]);

 useEffect(() => {
  let result = allJobs;

  // Location Filter
  if (localFilters.location !== "all_locations") {
    result = result.filter(job =>
      safeLower(job.location).includes(safeLower(localFilters.location))
    );
  }

  // Job Type Filter
  if (localFilters.jobType !== "all_types") {
    const selectedType = normalizeType(localFilters.jobType);
    result = result.filter(job => {
      const normalizedJobType = normalizeType(job.type);
      return normalizedJobType === selectedType;
    });
  }

  // Experience Filter
  if (localFilters.experience !== "all_levels") {
    const jobTypeLower = safeLower(localFilters.experience);
    if (jobTypeLower === "entry") {
      result = result.filter(job =>
        safeLower(job.type).includes("entry") ||
        safeLower(job.type).includes("internship")
      );
    } else if (jobTypeLower === "internship") {
      result = result.filter(job =>
        safeLower(job.type).includes("internship")
      );
    }
  }

  // Industry Filter
  if (localFilters.industry !== "all_industries" && localFilters.industry) {
    result = result.filter(job =>
      safeLower(job.industry) === safeLower(localFilters.industry)
    );
  }

  // Search Filter
  if (localFilters.search) {
    const searchLower = safeLower(localFilters.search);
    result = result.filter(job =>
      safeLower(job.title).includes(searchLower) ||
      safeLower(job.company).includes(searchLower) ||
      safeLower(job.location).includes(searchLower) ||
      (Array.isArray(job.skills) ? job.skills : []).some(skill =>
        safeLower(skill).includes(searchLower)
      )
    );
  }

  // Skills Filter
  if (localFilters.skills.length > 0) {
    result = result.filter((job) =>
      localFilters.skills.every((filterSkill: string) =>
        job.skills.some(
          (jobSkill: string) =>
            safeLower(jobSkill) === safeLower(filterSkill)
        )
      )
    );
  }

  // Sort by Most Recent
  result.sort((a, b) => {
    if (a.postedDate && b.postedDate) {
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
    return 0;
  });

  setFilteredJobs(result);
}, [localFilters, allJobs]);


  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (jobId: number) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save jobs.",
      });
      navigate("/login");
      return;
    }

    const isAlreadySaved = savedJobs.includes(jobId);

    try {
      const endpoint = isAlreadySaved
        ? `${API_BASE}/api/unsave`
        : `${API_BASE}/api/save`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          seeker_id: Number(user.id),
        }),
      });

      if (!res.ok) throw new Error("Failed to update saved job");

      setSavedJobs((prev) =>
        isAlreadySaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      );

      toast({
        title: isAlreadySaved ? "Job Unsaved" : "Job Saved",
        description: isAlreadySaved
          ? "This job was removed from your saved list."
          : "This job has been saved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update saved job.",
      });
    }
  };

const handleApply = async (jobId: number) => {
  if (!user?.id) return;

  try {
    const token = localStorage.getItem("access_token");
    const resumeRes = await fetch(`${API_BASE}/api/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resumeSnapshot = await resumeRes.json();

    if (!resumeSnapshot || Object.keys(resumeSnapshot).length === 0) {
      toast({
        title: "Resume Missing",
        description: "Please complete your resume before applying.",
      });
      return;
    }

    const res = await fetch(`${API_BASE}/api/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant_id: user.id,
        job_id: jobId,
        resume_snapshot: resumeSnapshot,
      }),
    });

    if (!res.ok) throw new Error("Failed to apply");

    toast({
      title: "Application Sent",
      description: "Your application has been submitted successfully!",
    });

    setAppliedJobs(prev => [...prev, jobId]);
    setAllJobs(prev => prev.map(j => j.id === jobId ? { ...j, is_applied: true } : j));
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to apply.",
    });
  }
};


  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setLoadingMore(false);
      toast({ description: "All available jobs have been loaded" });
    }, 1000);
  };

  const displayedJobs = fullPage ? filteredJobs : filteredJobs.slice(0, 6);

  return (
  <section id="jobs" className={`py-16 bg-white ${fullPage ? 'pt-0' : ''}`} ref={jobsRef}>
    <div className="container mx-auto px-4">
      {!fullPage && (
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 opacity-0 fade-in-up"
          ref={headingRef}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Job Opportunities</h2>
            <p className="text-gray-600">Discover fresh opportunities perfect for your career start</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              asChild
              variant="link"
              className="flex items-center text-[#F6C500] font-semibold hover:text-[#FFD700] transition-colors duration-200"
            >
              <Link href="/jobs">
                View All Jobs <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </Button>
          </div>
        </div>
      )}

      {!fullPage && (
        <div className="mb-8 p-4 bg-[#FFFBEA] rounded-lg opacity-0 fade-in-up animate-delay-100" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</Label>
              <Select
                value={localFilters.location}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
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

            <div>
              <Label htmlFor="job-type" className="block text-sm font-medium text-gray-700 mb-1">Job Type</Label>
              <Select
                value={localFilters.jobType}
                onValueChange={(value) => handleFilterChange("jobType", value)}
              >
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

            <div>
              <Label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience</Label>
              <Select
                value={localFilters.experience}
                onValueChange={(value) => handleFilterChange("experience", value)}
              >
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

            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Keywords, Job Title, Company..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {displayedJobs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">No matching jobs found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters to find more opportunities</p>
          {fullPage && (
            <Button
              variant="outline"
              className="border-[#F6C500] text-black hover:bg-[#FFFBEA]"
              onClick={() => {
                setLocalFilters({
                  location: "all_locations",
                  jobType: "all_types",
                  experience: "all_levels",
                  industry: "all_industries",
                  search: "",
                  skills: []
                });
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {displayedJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedJobs.map((job, index) => (
            <JobCard
                key={job.id}
                job={job}
                animationDelay={(index % 3) * 100}
                isApplied={appliedJobs.includes(job.id)}
                isSaved={savedJobs.includes(job.id)}
                onSave={handleSave}
                canSave={isAuthenticated && isRole("job_seeker")}   // ✅ only job seekers can save
                onApplySuccess={(jobId: number) => {
                  setAppliedJobs(prev => [...prev, jobId]);
                  setAllJobs(prev => prev.map(j => j.id === jobId ? { ...j, is_applied: true } : j));
                }}
              />

          ))}
        </div>
      )}

      {fullPage && displayedJobs.length > 0 && (
        <div className="text-center mt-10 opacity-0 fade-in-up animate-delay-300">
          <Button
            className="bg-white border-2 border-[#F6C500] text-[#F6C500] hover:bg-[#FFFBEA] rounded-full font-bold transition-colors duration-200"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Jobs'}
          </Button>
        </div>
      )}
    </div>
  </section>
);

};

export default JobListings;
