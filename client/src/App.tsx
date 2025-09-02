import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import JobsPage from "@/pages/JobsPage";
import ResumeBuilder from "@/pages/ResumeBuilder";
import PostJob from "@/pages/PostJob";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileRouter from "@/pages/ProfileRouter";
import AdminPanel from "@/pages/AdminPanel";
import CompanyInfo from "@/pages/EmployerRegister/CompanyInfo";
import FoundingInfo from "@/pages/EmployerRegister/FoundingInfo";
import SocialMedia from "@/pages/EmployerRegister/SocialMedia";
import Contact from "@/pages/EmployerRegister/Contact";
import Complete from "@/pages/EmployerRegister/Complete";
import StudentRegister from "@/pages/StudentRegister";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/contexts/UserContext";
import HomePage from "@/pages/Home.tsx";
import ApplicantsPage from "@/pages/ApplicantsPage.tsx";
import EditJobPage from './pages/EditJobPage'; 
import JobDetailsPage from './pages/JobDetailsPage';
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPasswordPage from '@/pages/ForgotPassword';
import MeetOurTeam from "./components/MeetOurTeam";



/**
 * Router component that handles all application routes
 * Sets up main routes for the application, including home, jobs, resume builder, 
 * post job, and role-specific pages
 */
function Router() {
  const { isAuthenticated, isRole } = useUser();
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={() => {
            if (isAuthenticated) {
              if (isRole("job_seeker")) return <Redirect to="/dashboard" />;
              if (isRole("employer")) return <Redirect to="/dashboard" />;
              if (isRole("admin")) return <Redirect to="/admin" />;
            }
            return <HomePage />;
          }} />

        <Route path="/jobs" component={JobsPage} />
        <Route path="/resume-builder" component={ResumeBuilder} />
        <Route path="/post-job" component={PostJob} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/register/employer" component={CompanyInfo} />
        <Route path="/register/employer/founding-info" component={FoundingInfo} />
        <Route path="/register/employer/social-media" component={SocialMedia} />
        <Route path="/register/employer/contact" component={Contact} />
        <Route path="/register/employer/complete" component={Complete} />
        <Route path="/register/student" component={StudentRegister} />
        <Route path="/profile" component={ProfileRouter} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/employer/edit-job/:jobId" component={EditJobPage} />
        <Route path="/employer/job/:jobId/applicants" component={ApplicantsPage} />
        <Route path="/jobs/:id" component={JobDetailsPage} />
        <Route path="/email-verification" component={EmailVerification} />
        <Route path="/verify-email" component={EmailVerification} />       
        <Route path="/reset-code" component={ResetPassword} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/meet-the-team" component={MeetOurTeam} />

        
        {/* Redirects for authenticated users */}

        
        {/* Redirect authenticated users to dashboard */}
        <Route component={NotFound} />
        
      </Switch>
      <Footer />
    </>
  );
}

/**
 * Main App component
 * Sets up providers for the application:
 * - QueryClientProvider for data fetching
 * - UserProvider for authentication and user management
 * - Toaster for notifications
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Toaster />
        <Router />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
