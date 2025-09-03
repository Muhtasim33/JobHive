import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/config";

const ApplicantsPage = () => {
  const [match, params] = useRoute("/employer/job/:jobId/applicants");
  const jobId = params?.jobId;
  const [applicants, setApplicants] = useState<Applicant[]>([]);


  interface Applicant {
  id: number;
  name: string;
  email: string;
  resume_snapshot: {
    cv_url?: string;
  };
}


  useEffect(() => {
  if (!jobId) return;

  fetch(apiUrl(`/api/jobs/${jobId}/applicants`))
    .then((res) => res.json())
    .then((data) => {
      console.log("Applicants response:", data); // 👈 check this
      setApplicants(data);
    })
    .catch((err) => console.error("Error loading applicants", err));
}, [jobId]);


  if (!match) {
    return <div>Invalid job ID</div>;
  }

  return (
    <main className="py-20 px-4">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Applicants for Job #{jobId}</h1>

        {applicants.length === 0 ? (
          <p>No applicants found.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold">{applicant.name}</h2>
                  <p>Email: {applicant.email}</p>
                <p className="flex items-center gap-2 mt-2">
                  CV:
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(applicant.resume_snapshot?.cv_url, '_blank')}
                    disabled={!applicant.resume_snapshot?.cv_url}
                  >
                    Preview
                  </Button>


                  <a
                    href={applicant.resume_snapshot?.cv_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  </a>
                  {!applicant.resume_snapshot?.cv_url && (
    <span className="text-sm text-red-500 ml-2">No resume uploaded</span>
      )}
                </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ApplicantsPage;
