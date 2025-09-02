import { useUser } from "@/contexts/UserContext";
import JobSeekerProfile from "@/pages/Profiles/JobSeekerProfile";
import EmployerProfile from "@/pages/Profiles/EmployerProfile"; // you'll add this soon

export default function ProfileRouter() {
  const { user } = useUser();

  if (!user) return null;

  switch (user.role) {
    case "job_seeker":
    case "student": // if needed
      return <JobSeekerProfile />;
    case "employer":
      return <EmployerProfile />;
    default:
      return <div>Unauthorized</div>;
  }
}
