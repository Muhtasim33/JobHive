
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { getResumeData } from "@/utils/resumeUtils";
import { getAppliedJobs } from "@/utils/jobUtils";
import { apiUrl, imageUrl } from "@/config";


interface Job {
  id: number;
  title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  salary: string;
  type: string;
  deadline: string;
  description: string;
  requirements: string;
  skills?: string[];
  schedule?: string;
  postedDate?: string;
}

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, isAuthenticated, isRole } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();



  const handleReportJob = async () => {
  const reason = prompt("Please enter the reason for reporting this job:");

  if (!reason) return;

  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(apiUrl("/api/reports"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        job_id: job?.id,
        reason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Failed to submit report");
    }

    toast({
      title: "Report submitted",
      description: "Thank you for helping us keep the platform safe.",
    });
  } catch (error) {
    toast({
      title: "Error submitting report",
      description: String(error),
      variant: "destructive",
    });
  }
};

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(apiUrl(`/api/jobs/${id}`));
      const data = await res.json();
      setJob(data);
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const fetchApplied = async () => {
      if (user?.id && isRole("job_seeker")) {
        try {
          const applied = await getAppliedJobs(Number(user.id));
          const jobIds = applied.map((job: any) => job.id);
          setIsApplied(jobIds.includes(Number(id)));
        } catch (err) {
          console.error("Failed to load applied jobs", err);
        }
      }
    };

    fetchApplied();
  }, [user?.id, id]);

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

    const resumeRes = await fetch(apiUrl("/api/resume"), {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resumeSnapshot = await resumeRes.json();

    if (!resumeSnapshot || !resumeSnapshot.cv_url) {
      toast({
        title: "Resume Missing",
        description: "Please upload your resume before applying.",
        variant: "destructive",
      });
      return;
    }

    const res = await fetch(apiUrl("/api/apply"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant_id: user!.id,
        job_id: job!.id,
        resume_snapshot: resumeSnapshot,
      }),
    });

    if (!res.ok) throw new Error("Failed to apply");

    toast({
      title: "Application Submitted",
      description: "Your resume was sent!",
      variant: "default",
    });

    setIsApplied(true);
  } catch (err: any) {
    toast({
      title: "Failed to Apply",
      description: err.message,
      variant: "destructive",
    });
  }
};



  const handleSave = async () => {
    if (!user?.id) return;

    const endpoint = isSaved ? apiUrl("/api/unsave") : apiUrl("/api/save");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job!.id, seeker_id: user.id })
      });

      if (!res.ok) throw new Error(`Failed to ${isSaved ? "unsave" : "save"} job`);

      toast({
        title: isSaved ? "Unsaved" : "Saved!",
        description: isSaved
          ? "This job has been removed from your saved list."
          : "This job has been saved.",
        variant: "default"
      });

      setIsSaved(!isSaved);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <section className="pt-28 md:pt-24 px-4 md:px-16 pb-16 min-h-screen bg-white animate-fadeIn">
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-xl p-10">
        <Button
          onClick={() => navigate("/jobs")}
          className="mb-6 bg-[#F6C500] text-black hover:bg-[#e6b800] transition rounded-full"
        >
          ← Back to Jobs
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">{job.title}</h1>

        <div className="text-gray-700 space-y-3 mb-8 leading-relaxed text-base">
          <div className="flex items-center gap-3">
            {job.company_logo && (
              <img
                src={imageUrl(job.company_logo)}
                alt={`${job.company_name} logo`}
                className="w-10 h-10 object-cover rounded-full border"
              />
            )}
            <p className="text-lg font-medium text-gray-800">{job.company_name || "N/A"}</p>
          </div>

          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Type:</strong> {job.type || "N/A"}</p>
          <p><strong>Deadline:</strong> {job.deadline}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Requirements</h2>
          <p className="text-gray-600 leading-relaxed">{job.requirements}</p>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleApply}
            className={`rounded-full px-6 py-2 text-sm font-semibold shadow-md transition duration-200 ${isApplied ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#F6C500] text-black hover:bg-[#FFD700]"}`}
            disabled={isApplied}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </Button>

          {isAuthenticated && isRole("job_seeker") && (
    <>
          <Button
            variant="outline"
            className={`rounded-full px-4 py-2 border-2 transition-all duration-200 ${isSaved ? "border-yellow-500 text-yellow-500" : "border-gray-300 text-gray-600 hover:border-yellow-500 hover:text-yellow-500"}`}
            onClick={handleSave}
            title={isSaved ? "Saved" : "Save Job"}
          >
            <i className={`${isSaved ? "fas" : "far"} fa-bookmark`}></i>
          </Button>

          <Button
            variant="outline"
            className="text-red-600 border-red-500"
            onClick={handleReportJob}
          >
            Report this Job
          </Button>
        </>
      )}
    </div>
      </div>
    </section>
  );
};

export default JobDetailsPage;


