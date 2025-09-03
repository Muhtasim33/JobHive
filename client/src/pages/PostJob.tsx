import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import JobForm from "@/components/forms/JobForm";
import { API_BASE } from '../config';

interface JobFormValues {
  title: string;
  type: string;
  location: string;
  is_remote: boolean;
  description: string;
  requirements: string;
  salary: string;
  deadline: string;
  skills: string[];
}

const PostJob = () => {
  const { ref: pageRef } = useScrollAnimation();
  const { isAuthenticated, user, isRole } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Post a Job - JobHive";
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isRole("employer")) {
      toast({
        title: "Access Restricted",
        description: "Job posting is only available to employer accounts.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, isRole, navigate, toast]);

  if (!isAuthenticated) {
    return (
      <main className="py-20 px-4" ref={pageRef}>
        <div className="container fade-in-up text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Post a Job</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Sign in with your employer account to post job opportunities.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#F6C500] text-black rounded"
          >
            Sign In to Post a Job
          </button>
        </div>
      </main>
    );
  }

  const handlePostJob = async (formData: JobFormValues) => {
    try {
      const jobData = {
        ...formData,
        employer_id: user?.id,
        company_name: user?.company_name,
        company_logo: user?.logo_url,
      };

      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) throw new Error("Failed to post job");

      toast({
        title: "Job Posted",
        description: "Your job has been successfully posted.",
      });

      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while posting the job.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="py-20 px-4" ref={pageRef}>
      <div className="container fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Post a New Job</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Fill in the details below to connect with talented students and graduates.
          </p>
        </div>

        <Card className="mb-10 max-w-3xl mx-auto">
          <CardContent className="p-6">
            <JobForm
              initialValues={{
                title: "",
                type: "",
                location: "",
                is_remote: false,
                description: "",
                requirements: "",
                salary: "",
                deadline: "",
                skills: [], // ✅ Now required
              }}
              onSubmit={handlePostJob}
              submitLabel="Post Job"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PostJob;

