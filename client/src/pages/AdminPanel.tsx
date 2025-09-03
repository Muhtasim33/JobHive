import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatText, formatStatus, formatDate } from "@/utils/formatters";
import { apiUrl } from "@/config";

/**
 * Admin Panel Page
 * 
 * Comprehensive dashboard for platform administrators
 * Features user management, content moderation, and analytics
 * Only accessible to authenticated admins
 */
const AdminPanel = () => {
  const { isAuthenticated, user, isRole } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const [stats, setStats] = useState({
  totalUsers: 0,
  activeJobs: 0,
  applications: 0,
  pendingReports: 0,
});







  const formatRole = (role: string | undefined) => {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown";
};


interface Report {
  id: number,
  type: string,            // e.g., "Job", "User", etc.
  title: string,           // Display title
  status: string,          // "pending", "resolved", etc.
  reportedDate: string,    // In "YYYY-MM-DD" or similar format
  jobId: number;
  reason?: string;         // Optional reason for the report      
}


  type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
};

interface Job {
  id: number;
  title: string;
  company_name: string;
  status: string;
  deadline: string;
  postedDate: string;
}


useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(apiUrl("/api/admin/stats"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setStats({
        totalUsers: data.totalUsers || 0,
        activeJobs: data.activeJobs || 0,
        applications: data.applications || 0,
        pendingReports: data.pendingReports || 0,
      });

    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  fetchStats();
}, []);



useEffect(() => {
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(apiUrl("/api/admin/reports"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();
      setReports(data);
    } catch (err) {
      toast({
        title: "Error loading reports",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  fetchReports();
}, []);


const handleResolve = async (reportId: number) => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(apiUrl(`/api/admin/reports/${reportId}/resolve`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to resolve report");

    toast({ title: "Report resolved successfully" });

    // Refresh list
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: "resolved" } : r
      )
    );
  } catch (err) {
    toast({
      title: "Error resolving report",
      description: String(err),
      variant: "destructive",
    });
  }
};


const handleDeleteJob = async (jobId: number) => {
  if (!confirm("Are you sure you want to delete this job posting?")) return;

  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(apiUrl(`/api/jobs/${jobId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete job");
    }

    setJobs((prev) => prev.filter((job) => job.id !== jobId));

    toast({
      title: "Job deleted",
      description: `Job ID ${jobId} was successfully deleted.`,
    });
  } catch (error) {
    toast({
      title: "Error deleting job",
      description: String(error),
      variant: "destructive",
    });
  }
};


useEffect(() => {
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(apiUrl("/api/admin/jobs"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      toast({
        title: "Error loading jobs",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setJobsLoading(false);
    }
  };

  fetchJobs();
}, [toast]);

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(apiUrl("/api/admin/users"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error loading users",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [toast]);

  // Set page title
  useEffect(() => {
    document.title = "Admin Panel - JobHive";
  }, []);

  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (isAuthenticated) {
      if (!isRole('admin')) {
        toast({
          title: "Access Restricted",
          description: "Admin Panel is only available to administrators.",
          variant: "destructive"
        });
        navigate("/");
      }
    }
  }, [isAuthenticated, isRole, navigate, toast]);

  // Filter function for search
  const filteredUsers = users.filter((user: User) =>
  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
);



  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <main className="py-20 px-4">
        <div className="container">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Panel</h1>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Please sign in with administrator credentials to access the admin panel.
            </p>
            <Button 
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              onClick={() => navigate("/login")}
              size="lg"
            >
              Sign In to Access Admin Panel
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Admin Panel for authenticated admins
  return (
    <main className="py-20 px-4">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Platform management and analytics dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Admin Access
            </span>
            <span className="text-gray-600">
              Welcome, {user?.name}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.totalUsers}</div>
              {/* <p className="text-sm text-gray-500">+12 this week</p> */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.activeJobs}</div>
              {/* <p className="text-sm text-gray-500">+8 this week</p> */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.applications}</div>
              {/* <p className="text-sm text-gray-500">+35 this week</p> */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.pendingReports}</div>
              {/* <p className="text-sm text-gray-500">Requires attention</p> */}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full border-b mb-8">
            <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
            <TabsTrigger value="jobs" className="flex-1">Jobs</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1">Reports</TabsTrigger>
            {/* <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger> */}
            {/* <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger> */}
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative w-full sm:w-64">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                  {/* <Button style={{ backgroundColor: "#F6C500", color: "#000000" }}>
                    Add New User
                  </Button> */}
                </div>
                {loading ? (
                    <p className="text-gray-500">Loading users...</p>
                    ) : (
                      <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      {/* <TableHead>Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(searchTerm ? filteredUsers : users).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                            {formatText(user.role)}
                          </Badge>

                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {formatStatus(user.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                    )}

            </CardContent>
          </Card>
          </TabsContent>
          
          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex justify-between">
                  <h3 className="text-xl font-bold">Job Management</h3>
                  <Button style={{ backgroundColor: "#F6C500", color: "#000000" }}>
                    Add New Job
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.id}</TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company_name}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              job.status === 'active' ? 'bg-green-100 text-green-800' :
                              job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {formatStatus(job.status)}
                          </Badge>

                        </TableCell>
                        <TableCell>{formatDate(job.postedDate)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/jobs/${job.id}`)}
                            >
                              View
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                Delete Post
                              </Button>

                            {job.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-500"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Reported Content</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {reports.map((report) => (
                        <TableRow
                            key={report.id}
                            className="cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => navigate(`/jobs/${report.jobId}`)}
                          >
                          <TableCell>{report.id}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                report.status === 'resolved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {formatStatus(report.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(report.reportedDate)}</TableCell>
                          <TableCell>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedReportReason(report.reason ?? null);
                                      setIsReasonModalOpen(true);
                                    }}
                                  >
                                    View Reason
                                  </Button>

                                  {report.status !== 'resolved' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleResolve(report.id);
                                      }}
                                    >
                                      Resolve
                                    </Button>
                                  )}
                                </div>
                              </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>

                </Table>
              </CardContent>
            </Card>
          </TabsContent>         
        </Tabs>
         {isReasonModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">Report Reason</h2>
                  <p className="text-gray-700 whitespace-pre-line">{selectedReportReason}</p>
                  <div className="mt-6 text-right">
                    <Button onClick={() => setIsReasonModalOpen(false)}>Close</Button>
                  </div>
                </div>
              </div>
            )}
      </div>
    </main>
  );
};

export default AdminPanel;