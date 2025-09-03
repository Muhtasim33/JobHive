import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import JobForm from "@/components/forms/JobForm";
import { apiUrl } from "@/config";

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

const EditJobPage = () => {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/employer/edit-job/:jobId");
  const { toast } = useToast();
  const jobId = params?.jobId;

  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<JobFormValues>({
    title: "",
    type: "",
    location: "",
    is_remote: false,
    description: "",
    requirements: "",
    salary: "",
    deadline: "",
    skills: [], // ✅ Ensure skills is initialized
  });

  // Fetch existing job data
  useEffect(() => {
    if (!jobId) return;

    fetch(apiUrl(`/api/jobs/${jobId}`))
      .then((res) => {
        if (!res.ok) throw new Error("Job not found");
        return res.json();
      })
      .then((data) => {
        setJobData({
          title: data.title || "",
          type: data.type || "",
          location: data.location || "",
          is_remote: data.is_remote || false,
          description: data.description || "",
          requirements: data.requirements || "",
          salary: data.salary || "",
          deadline: data.deadline ? data.deadline.slice(0, 10) : "",
          skills: Array.isArray(data.skills) ? data.skills : [], // ✅ Parse skills
        });
        setLoading(false);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load job data.",
          variant: "destructive",
        });
        navigate("/dashboard");
      });
  }, [jobId, navigate, toast]);

  const handleUpdateJob = async (updatedData: JobFormValues) => {
    try {
      const response = await fetch(apiUrl(`/api/jobs/${jobId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast({
        title: "Job Updated",
        description: "The job was successfully updated.",
      });

      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Update Error",
        description: "There was a problem updating the job.",
        variant: "destructive",
      });
    }
  };

  if (!match) {
    return <div className="text-center mt-10">Invalid job URL.</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading job data...</div>;
  }

  return (
    <main className="py-20 px-4">
      <div className="container fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Edit Job</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Update your job posting below.
          </p>
        </div>

        <Card className="mb-10 max-w-3xl mx-auto">
          <CardContent className="p-6">
            <JobForm
              initialValues={jobData}
              onSubmit={handleUpdateJob}
              submitLabel="Save Changes"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EditJobPage;
