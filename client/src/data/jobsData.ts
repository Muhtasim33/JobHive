/**
 * Job Data
 * 
 * Sample job data for the application
 * Used to populate job listings until connected to a backend
 */

export interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  schedule: string;
  salary: string;
  skills: string[];
  icon: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  postedDate?: string;
}

export const jobs: Job[] = [
  {
    id: 1,
    title: "UI/UX Design Intern",
    company: "TechBee Company",
    type: "Internship",
    location: "Abrar Hossain Zahin (Remote)",
    schedule: "Part-time, 20 hours/week",
    salary: "300-500 JOD/month",
    skills: ["Figma", "UI Design", "Wireframing", "Adobe XD"],
    icon: "fa-laptop-code",
    description: "TechBee is looking for a passionate UI/UX Design Intern to join our creative team. You'll work on real client projects, creating user-friendly interfaces and gaining valuable industry experience.",
    requirements: [
      "Currently enrolled in a design-related program",
      "Basic knowledge of design tools (Figma, Adobe XD)",
      "Understanding of user-centered design principles",
      "Strong communication skills"
    ],
    benefits: [
      "Flexible remote working hours",
      "Mentorship from senior designers",
      "Portfolio-worthy projects",
      "Potential for full-time employment"
    ],
    postedDate: "2024-05-01"
  },
  {
    id: 2,
    title: "Junior Web Developer",
    company: "HiveWorks Solutions",
    type: "Full-time",
    location: "Cairo, Egypt (Hybrid)",
    schedule: "Full-time, 40 hours/week",
    salary: "5000-7000 EGP/month",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    icon: "fa-code",
    description: "HiveWorks is seeking a Junior Web Developer to join our development team. You'll work on building and maintaining web applications, with a focus on frontend development using React.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "Knowledge of React, JavaScript, HTML, and CSS",
      "Understanding of responsive design principles",
      "Problem-solving aptitude and attention to detail"
    ],
    benefits: [
      "Hybrid work schedule (3 days in office, 2 days remote)",
      "Health insurance",
      "Professional development budget",
      "Team outings and events"
    ],
    postedDate: "2024-04-28"
  },
  {
    id: 3,
    title: "Marketing Assistant",
    company: "BeeMarketing Agency",
    type: "Entry Level",
    location: "Dubai, UAE (On-site)",
    schedule: "Full-time, 40 hours/week",
    salary: "4000-6000 AED/month",
    skills: ["Social Media", "Content Creation", "Analytics"],
    icon: "fa-chart-bar",
    description: "BeeMarketing Agency is looking for a Marketing Assistant to support our marketing team in creating and implementing campaigns for our clients. This is an excellent opportunity for recent graduates to gain hands-on experience in digital marketing.",
    requirements: [
      "Bachelor's degree in Marketing, Communications, or related field",
      "Strong written and verbal communication skills",
      "Familiarity with social media platforms and basic analytics",
      "Creative mindset and attention to detail"
    ],
    benefits: [
      "Modern office in downtown Dubai",
      "Transportation allowance",
      "Health insurance",
      "Career advancement opportunities"
    ],
    postedDate: "2024-05-02"
  },
  {
    id: 4,
    title: "Data Analyst Intern",
    company: "DataHive",
    type: "Internship",
    location: "Remote",
    schedule: "Part-time, 15-20 hours/week",
    salary: "Unpaid (Academic Credit)",
    skills: ["Excel", "SQL", "Data Visualization", "Python (Basic)"],
    icon: "fa-chart-line",
    description: "DataHive is offering a Data Analyst internship for students interested in gaining real-world experience in data analysis. You'll work with our team on analyzing datasets, creating reports, and learning the fundamentals of business intelligence.",
    requirements: [
      "Currently enrolled in a Bachelor's or Master's program",
      "Strong Excel skills",
      "Basic understanding of SQL and data structures",
      "Analytical mindset and attention to detail"
    ],
    benefits: [
      "Flexible remote schedule",
      "Academic credit",
      "Mentorship from senior analysts",
      "Possibility of future employment"
    ],
    postedDate: "2024-04-25"
  },
  {
    id: 5,
    title: "Graduate Accountant",
    company: "BeeFinancial",
    type: "Entry Level",
    location: "Riyadh, Saudi Arabia (On-site)",
    schedule: "Full-time, 40 hours/week",
    salary: "6000-8000 SAR/month",
    skills: ["Accounting", "Excel", "Financial Reporting", "ERP Systems"],
    icon: "fa-calculator",
    description: "BeeFinancial is seeking a Graduate Accountant to join our growing finance team. This position is perfect for recent graduates looking to start their career in accounting and finance.",
    requirements: [
      "Bachelor's degree in Accounting, Finance, or related field",
      "Strong analytical and problem-solving skills",
      "Proficiency in Microsoft Excel",
      "Attention to detail and accuracy"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance",
      "Housing allowance",
      "Professional development support"
    ],
    postedDate: "2024-04-30"
  }
];

export const fetchJobs = async (filters: any = {}) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredJobs = [...jobs];
  
  // Apply filters
  if (filters.location && filters.location !== 'all_locations') {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.jobType && filters.jobType !== 'all_types') {
    filteredJobs = filteredJobs.filter(job => 
      job.type.toLowerCase().includes(filters.jobType.toLowerCase())
    );
  }
  
  if (filters.experience && filters.experience !== 'all_levels') {
    // Map experience filter values to job types
    const experienceMap: Record<string, string[]> = {
      'entry': ['Entry Level'],
      'internship': ['Internship'],
      '1-2': ['Junior', 'Entry Level'],
      '3+': ['Mid-Level', 'Senior']
    };
    
    if (filters.experience in experienceMap) {
      filteredJobs = filteredJobs.filter(job => 
        experienceMap[filters.experience].some(exp => 
          job.type.includes(exp)
        )
      );
    }
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm))
    );
  }
  
  return filteredJobs;
};
