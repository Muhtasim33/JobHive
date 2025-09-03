import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "./JobListings";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { getResumeData } from "@/utils/resumeUtils";
import { Link } from "wouter";
import { API_BASE } from '../config';

interface JobCardProps {
  job: Job;
  animationDelay?: number;
  isApplied?: boolean;
  isSaved?: boolean;
  onApplySuccess?: (jobId: number) => void;
  onSave?: (jobId: number) => void;
  canSave?: boolean;
  
}

const JobCard = ({
  job,
  animationDelay = 0,
  onApplySuccess,
  isApplied = false,
  isSaved = false,
  canSave = false,
  onSave,
}: JobCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isRole, user } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  

  const getPostedDate = () => {
  if (!job.postedDate) return "Recently posted";
  const posted = new Date(job.postedDate);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Posted just now";
  if (diffMinutes < 60) return `Posted ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `Posted ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Posted yesterday";
  return `Posted ${diffDays} days ago`;
};



  const handleSave = async (jobId: number) => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${API_BASE}/api/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, user_id: user.id }),
      });

      if (!res.ok) throw new Error("Failed to save job");

      toast({
        title: "Saved!",
        description: "This job has been saved.",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

const handleApply = async () => {
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please log in to apply",
      variant: "default",
    });
    navigate("/login");
    return;
  }

  if (!isRole("job_seeker")) {
    toast({
      title: "Only students can apply",
      description: "Use a student account to apply",
      variant: "destructive",
    });
    return;
  }

  try {
    const token = localStorage.getItem("access_token");
    const resumeRes = await fetch(`${API_BASE}/api/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resumeSnapshot = await resumeRes.json();

    const res = await fetch(`${API_BASE}/api/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant_id: user!.id,
        job_id: job.id,
        resume_snapshot: resumeSnapshot, // ✅ use this directly
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to apply");
    }

    toast({
      title: "Application Submitted",
      description: "Your resume was sent!",
      variant: "default",
    });

    if (onApplySuccess) onApplySuccess(job.id);
  } catch (err: any) {
    toast({
      title: "Failed to Apply",
      description: err.message,
      variant: "destructive",
    });
  }
};



  
  return (
  <div
  className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden opacity-0 fade-in-up"
  style={{ animationDelay: `${animationDelay}ms` }}
  ref={cardRef}
>
  {/* Floating Badges */}
  <div className="absolute top-3 left-3 z-10">
    <Badge className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full shadow">
      {job.job_type}
    </Badge>
  </div>

  {job.status && (
    <div className="absolute top-3 right-3 z-10">
      <Badge
        className={`text-xs px-2 py-1 rounded-full ${
          job.status === "expired" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
        }`}
      >
        {job.status === "expired" ? "Expired" : "Active"}
      </Badge>
    </div>
  )}

  {/* Card Content Wrapped with Link */}
  <Link href={`/jobs/${job.id}`} className="block p-4 pt-14 border-b">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold">{job.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {job.company_logo && (
            <img
              src={`${API_BASE}${job.company_logo}`}
              alt={`${job.company_name} logo`}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="text-gray-600 text-sm font-medium">{job.company_name}</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-[#FFFBEA] rounded-lg flex items-center justify-center">
        <i className={`fas ${job.icon || "fa-briefcase"} text-[#F6C500] text-xl`} />
      </div>
    </div>
  </Link>

  {/* Bottom Section - not linked */}
  <div className="p-4">
    <div className="flex items-center text-gray-600 mb-2">
      <i className="fas fa-map-marker-alt mr-2" />
      <span>{job.location}</span>
    </div>
    <div className="flex items-center text-gray-600 mb-2">
      <i className="fas fa-money-bill-wave mr-2" />
      <span>{job.salary}</span>
    </div>
    <div className="flex items-center text-gray-500 text-sm mb-3">
      <i className="fas fa-calendar-alt mr-2" />
      <span>{getPostedDate()}</span>
    </div>

    <div className="flex flex-wrap gap-2 mt-3 mb-4">
      {(job.skills || []).map((skill: string, idx: number) => (
        <Badge
          key={idx}
          variant="outline"
          className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-xs"
        >
          {skill}
        </Badge>
      ))}
    </div>

    <div className="flex justify-between mt-3">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleApply();
        }}
        className={`rounded-full ${
          isApplied || job.status === "expired"
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : ""
        }`}
        disabled={isApplied || job.status === "expired"}
        style={
          !isApplied && job.status !== "expired"
            ? { backgroundColor: "#F6C500", color: "#000000" }
            : {}
        }
      >
        {isApplied ? "Applied" : job.status === "expired" ? "Closed" : "Apply Now"}
      </Button>

      {canSave && (
        <Button
          variant="outline"
          className="border border-gray-300 text-gray-600 rounded-full"
          title={isSaved ? "Saved" : "Save Job"}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onSave?.(job.id);
          }}
        >
          <i className={isSaved ? "fas fa-bookmark" : "far fa-bookmark"}></i>
        </Button>
)}

    </div>
  </div>
</div>

);




};

export default JobCard;

