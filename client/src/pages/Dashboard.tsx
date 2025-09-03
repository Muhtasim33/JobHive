import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { getAppliedJobs } from "@/utils/jobUtils";
import { calculateResumeCompletion } from "@/utils/calculateResumeCompletion";
import { getResumeData } from "@/utils/resumeUtils"; // or wherever it lives
import { Link } from "wouter";
import { API_BASE } from '../config';



interface Job {
  id: number;
  title: string;
  job_type: string;
  location: string;
  is_remote: boolean;
  description: string;
  requirements: string;
  salary?: string;
  deadline?: string;
  applicant_count?: number;
  status?: 'active' | 'expired';
}

const Dashboard = () => {
  const { ref: pageRef } = useScrollAnimation();
  const { isAuthenticated, user, isRole } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [resumeCompletion, setResumeCompletion] = useState<number>(0);
  const [stats, setStats] = useState<{
  total_users: number;
  active_jobs: number;
  total_applications: number;
  success_rate: number;
} | null>(null);



// useEffect(() => {
//   fetch("http://localhost:8000/api/admin/stats")
//     .then((res) => res.json())
//     .then(setStats)
//     .catch((err) => console.error("Failed to load stats:", err));
// }, []);


  const handleEdit = (jobId: number) => {
  navigate(`/employer/edit-job/${jobId}`);
};

const handleViewApplicants = (jobId: number) => {
  navigate(`/employer/job/${jobId}/applicants`);
};

useEffect(() => {
  const fetchResume = async () => {
    try {
      const resume = await getResumeData();
      const percent = calculateResumeCompletion(resume);
      setResumeCompletion(percent);
    } catch (error) {
      console.error("Failed to load resume", error);
    }
  };

  if (isAuthenticated && isRole("job_seeker")) {
    fetchResume();
  }
}, [isAuthenticated]);
  

useEffect(() => {
  const fetchSavedJobs = async () => {
    if (!user?.id || !isRole("job_seeker")) return;

    try {
      const res = await fetch(`${API_BASE}/api/job-seeker/${user.id}/saved-jobs`);
      if (!res.ok) throw new Error("Failed to fetch saved jobs");
      const data = await res.json();
      setSavedJobs(data);
    } catch (err) {
      console.error("Error loading saved jobs:", err);
    }
  };

  fetchSavedJobs();
}, [user]);


useEffect(() => {
  const fetchApplied = async () => {
    if (user?.id && isRole("job_seeker")) {
      try {
        const jobs = await getAppliedJobs(Number(user.id));
        setAppliedJobs(jobs);
      } catch (err) {
        console.error("Failed to load applied jobs", err);
      }
    }
  };

  fetchApplied();
}, [user]);


 const fetchMyJobs = async () => {
  if (user?.id) {
    try {
      const res = await fetch(`${API_BASE}/api/employer/${user.id}/jobs`);
      const data = await res.json();
      setMyJobs(data.jobs);
    } catch (error) {
      console.error("Failed to fetch employer jobs:", error);
    }
  }
};

useEffect(() => {
  fetchMyJobs();
}, [user?.id]);


const toggleStatus = async (job: Job) => {
  const action = job.status === "expired" ? "activate" : "expire";
  const confirmed = window.confirm(`Are you sure you want to mark this job as ${action}?`);
  if (!confirmed) return;

  const newStatus = job.status === "expired" ? "active" : "expired";

  try {
    await fetch(`${API_BASE}/api/jobs/${job.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    toast({
      title: `Success`,
      description: `Job marked as ${newStatus}.`,
    });

    fetchMyJobs();
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update job status.",
    });
  }
};


const deleteJob = async (jobId: number) => {
  const confirmed = window.confirm("Are you sure you want to delete this job?");
  if (!confirmed) return;

  try {
    await fetch(`${API_BASE}/api/jobs/${jobId}`, {
      method: 'DELETE',
    });

    toast({
      title: "Job Deleted",
      description: "The job post has been deleted successfully.",
    });

    fetchMyJobs();
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to delete the job.",
    });
  }
};




  useEffect(() => {
    document.title = "Dashboard - JobHive";
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="py-20 px-4" ref={pageRef}>
        <div className="container fade-in-up">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Sign in to access your personalized dashboard with job applications, saved jobs, and more.
            </p>
            <Button 
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              onClick={() => navigate("/login")}
              size="lg"
            >
              Sign In to Access Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isRole('employer')) {
    return (
      <main className="py-20 px-4 flex justify-center" ref={pageRef}>
        <div className="w-full max-w-5xl fade-in-up">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Employer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate("/post-job")}
                style={{ backgroundColor: "#F6C500", color: "#000000" }}
              >
                Post New Job
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Posted Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{myJobs.length}</div>
                <p className="text-sm text-gray-500">Active job listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {myJobs.reduce((sum, job) => sum + (job.applicant_count || 0), 0)}
                </div>

                <p className="text-sm text-gray-500">Across all job postings</p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">138</div>
                <p className="text-sm text-gray-500">In the last 30 days</p>
              </CardContent>
            </Card> */}
          </div>

          <Tabs defaultValue="jobs">
            <TabsList className="w-full border-b mb-8">
              <TabsTrigger value="jobs" className="flex-1">My Job Postings</TabsTrigger>
              {/* <TabsTrigger value="applicants" className="flex-1">Recent Applicants</TabsTrigger> */}
            </TabsList>
            <TabsContent value="jobs">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {myJobs.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
                            <i className="fas fa-briefcase text-5xl text-gray-300 mb-4"></i>
                            <h2 className="text-2xl font-semibold mb-2">You haven’t posted any jobs yet</h2>
                            <p className="mb-6">Start by posting a job to attract applicants.</p>
                            <Button
                              onClick={() => navigate("/post-job")}
                              style={{ backgroundColor: "#F6C500", color: "#000000" }}
                              className="px-6 py-2 rounded-full"
                            >
                              Post a Job
                            </Button>
                          </div>
                        ) : (
                          myJobs.map((job) => (
                            <Link key={job.id} href={`/jobs/${job.id}`}>
                              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                    <p className="text-gray-600">
                                      {job.job_type} • {job.location}
                                    </p>
                                  </div>
                                  <Badge
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      job.status === "expired"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    {job.status === "expired" ? "Expired" : "Active"}
                                  </Badge>

                                </div>
                                <div className="flex justify-between mt-4">
                                  <p className="text-sm text-gray-500">Deadline: {job.deadline}</p>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(job.id);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleViewApplicants(job.id);
                                      }}
                                    >
                                      View Applicants
                                    </Button>
                                      {/* Toggle Status */}
                                    <Button variant="secondary" size="sm" onClick={(e) => {
                                      e.preventDefault();
                                      toggleStatus(job);
                                    }}>
                                      {job.status === 'expired' ? 'Activate' : 'Mark as Expired'}
                                    </Button>

                                    {/* Delete */}
                                    <Button variant="destructive" size="sm" onClick={(e) => {
                                      e.preventDefault();
                                      deleteJob(job.id);
                                    }}>
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))
                        )}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    );
  }


  if (isRole("job_seeker")) {
  return (
    <main className="py-20 px-4" ref={pageRef}>
      <div className="container fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-gray-600">
              Explore new jobs and keep your resume up to date
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/resume-builder")}
              className="bg-[#F6C500] text-black"
            >
              Update Resume
            </Button>
            <Button variant="outline" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{appliedJobs.length}</div>
              <p className="text-sm text-gray-500">Jobs you've applied to</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Saved Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{savedJobs.length}</div>
              <p className="text-sm text-gray-500">Jobs you've bookmarked</p>
            </CardContent>
          </Card>
          <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Resume Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{resumeCompletion}%</div>
            <Progress value={resumeCompletion} className="h-2 mb-2" />
            <p className="text-sm text-gray-500">
              Complete your resume to improve visibility
            </p>
          </CardContent>
        </Card>

        </div>

        
        <Tabs defaultValue="applications">
  <TabsList className="w-full border-b mb-8">
    <TabsTrigger value="applications" className="flex-1">
      📄 My Applications
    </TabsTrigger>
    <TabsTrigger value="saved" className="flex-1">
      🔖 Saved Jobs
    </TabsTrigger>
    <TabsTrigger value="recommended" className="flex-1">
      ✨ Recommended
    </TabsTrigger>
  </TabsList>

  <TabsContent value="applications">
    {appliedJobs.length === 0 ? (
      <p className="text-gray-500">No applications yet.</p>
    ) : (
      <div className="space-y-4">
        {appliedJobs.map((job, index) => (
          <div key={`${job.id}-${index}`} className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-sm text-gray-600">
              {job.location} • {job.job_type}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Deadline: {job.deadline}
            </p>
          </div>
        ))}
      </div>
    )}
  </TabsContent>

  <TabsContent value="saved">
    {savedJobs.length === 0 ? (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">You haven't saved any jobs yet.</p>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-4">
        {savedJobs.map((job, index) => (
          <div key={`${job.id}-${index}`} className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-sm text-gray-600">
              {job.location} • {job.job_type}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Deadline: {job.deadline}
            </p>
          </div>
        ))}
      </div>
    )}
  </TabsContent>

  <TabsContent value="recommended">
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-500">Recommended jobs will appear here.</p>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>

      </div>
    </main>
  );
}



  return null;
};

export default Dashboard;
