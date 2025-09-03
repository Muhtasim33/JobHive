import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { API_BASE } from '../config';
import { 
  ATSTemplate,
  availableTemplates, 
  type ResumeData, 
  type Education,
  type Experience,
  type Skill,
  type Certification,
  type TemplateType 
} from "@/components/resume-templates";
import { 
  generatePDF, 
  emptyResumeData, 
  saveResumeData, 
  getResumeData,
  saveTemplateChoice,
  getTemplateChoice
} from "@/utils/resumeUtils";

/**
 * Resume Builder Page
 * 
 * A comprehensive tool for students and graduates to create professional resumes
 * Features step-by-step process with templates and guidance for each section
 * Only accessible to authenticated students
 */
const ResumeBuilder = () => {
  const { ref: pageRef } = useScrollAnimation();
  const { isAuthenticated, user, isRole } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const previewRef = useRef<HTMLDivElement>(null);
  
  
  // Resume data state
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('ats');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
const handleSaveResumeToServer = async () => {
  try {
    setIsGeneratingPDF(true);

    toast({
      title: "Saving Resume...",
      description: "Please wait while we generate and save your resume.",
    });

    // 1. Generate PDF blob
    const blob = await generatePDF("resume-to-print", "resume.pdf", true);
    if (!(blob instanceof Blob)) throw new Error("Invalid PDF blob");

    // 2. Upload to server to get public URL
    const formData = new FormData();
    formData.append("file", blob, "resume.pdf");

    const uploadRes = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const { url: pdfUrl } = await uploadRes.json();
    if (!pdfUrl) throw new Error("Upload failed, no URL returned");

    // ✅ 3. Save full resume data + cv_url
    const token = localStorage.getItem("access_token");
    const saveRes = await fetch(`${API_BASE}/api/resume/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...resumeData,  // all resume fields
        cv_url: pdfUrl, // add generated PDF URL
      }),
    });

    if (!saveRes.ok) {
      const errorData = await saveRes.json();
      throw new Error(errorData?.message || "Resume save failed");
    }

    toast({
      title: "Resume Saved",
      description: "Your resume was uploaded and saved successfully.",
    });

  } catch (err) {
    console.error("Error saving resume:", err);
    toast({
      title: "Error",
      description: "Could not save resume. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsGeneratingPDF(false);
  }
};





  // Set page title and load saved data if available
  useEffect(() => {
  document.title = "Resume Builder - JobHive";
  
  // Async function to load data
  const loadData = async () => {
    try {
      // Load saved resume data
      const savedData = await getResumeData();
      if (savedData) {
        setResumeData(savedData);
      }
      
      // Load saved template choice
      const savedTemplate = getTemplateChoice() as TemplateType;
      if (savedTemplate) {
        setSelectedTemplate(savedTemplate);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  loadData();
}, []);

  // Check if user is authenticated and has student role
  useEffect(() => {
    if (isAuthenticated) {
      if (!isRole('job_seeker')) {
        toast({
          title: "Access Restricted",
          description: "Resume Builder is only available to student accounts.",
          variant: "destructive"
        });
        navigate("/");
      }
    }
  }, [isAuthenticated, isRole, navigate, toast]);
  
  // Handle input changes for personal information
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle saving personal information
  const handleSavePersonalInfo = () => {
    saveResumeData({
      firstName: resumeData.firstName,
      lastName: resumeData.lastName,
      email: resumeData.email,
      phone: resumeData.phone,
      linkedIn: resumeData.linkedIn,
      summary: resumeData.summary
    });
    
    toast({
      title: "Personal Information Saved",
      description: "Your personal information has been saved successfully."
    });
    
    // Move to the next tab
    setActiveTab("education");
  };
  
  // Handle education changes
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setResumeData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };
  
  // Add new education entry
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          startDate: '',
          endDate: '',
          relevantCourses: '',
          achievements: ''
        }
      ]
    }));
  };
  
  // Remove education entry
  const removeEducation = (index: number) => {
    if (resumeData.education.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one education entry.",
        variant: "destructive"
      });
      return;
    }
    
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };
  
  // Handle saving education information
  const handleSaveEducation = () => {
    saveResumeData({
      education: resumeData.education
    });
    
    toast({
      title: "Education Saved",
      description: "Your education information has been saved successfully."
    });
    
    // Move to the next tab
    setActiveTab("experience");
  };
  
  // Handle experience changes
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    setResumeData(prev => {
      const updatedExperience = [...prev.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };
  
  // Add new experience entry
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };
  
  // Remove experience entry
  const removeExperience = (index: number) => {
    if (resumeData.experience.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one experience entry.",
        variant: "destructive"
      });
      return;
    }
    
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };
  
  // Handle saving experience information
  const handleSaveExperience = () => {
    saveResumeData({
      experience: resumeData.experience
    });
    
    toast({
      title: "Experience Saved",
      description: "Your experience information has been saved successfully."
    });
    
    // Move to the next tab
    setActiveTab("skills");
  };
  
  // Handle skill changes
  const handleSkillChange = (index: number, value: string) => {
    setResumeData(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        name: value
      };
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };
  
  // Add new skill
  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { name: '' }
      ]
    }));
  };
  
  // Remove skill
  const removeSkill = (index: number) => {
    if (resumeData.skills.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one skill.",
        variant: "destructive"
      });
      return;
    }
    
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  // Handle saving skills information
  const handleSaveSkills = () => {
    saveResumeData({
      skills: resumeData.skills
    });
    
    toast({
      title: "Skills Saved",
      description: "Your skills have been saved successfully."
    });
    
    // Move to the preview tab
    setActiveTab("preview");
  };
  
  // Handle template selection
  const handleTemplateSelection = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    saveTemplateChoice(templateId);
    
    toast({
      title: "Template Selected",
      description: `You've selected the ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template.`
    });
  };
  
  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      toast({
        title: "Preparing Download",
        description: "Please wait while we generate your PDF...",
      });
      
      // Small delay to ensure the UI is updated before PDF generation starts
      setTimeout(async () => {
        try {
          // Generate filename with proper fallbacks if name fields are empty
          const firstName = resumeData.firstName || 'My';
          const lastName = resumeData.lastName || 'Resume';
          const filename = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${selectedTemplate}_resume.pdf`;
          
          // Generate PDF with selected template
          await generatePDF('resume-to-print', filename);
          
          toast({
            title: "PDF Generated",
            description: "Your resume has been downloaded as a PDF file."
          });
        } catch (error) {
          console.error("Error generating PDF:", error);
          toast({
            title: "Error",
            description: "There was an error generating your PDF. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsGeneratingPDF(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error in download handler:", error);
      toast({
        title: "Download Failed",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive"
      });
      setIsGeneratingPDF(false);
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <main className="py-20 px-4" ref={pageRef}>
        <div className="container fade-in-up">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Resume Builder</h1>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Our resume builder is designed specifically for students and fresh graduates.
              Sign in with your student account to access this feature.
            </p>
            <Button 
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              onClick={() => navigate("/login")}
              size="lg"
            >
              Sign In to Access Resume Builder
            </Button>
          </div>
          {/* LoginModal removed - now using dedicated login page */}
        </div>
      </main>
    );
  }

  // For authenticated students, show resume builder
  return (
    <main className="py-20 px-4" ref={pageRef}>
      <div className="container fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Your Professional Resume</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Our resume builder is designed specifically for students and fresh graduates.
            Highlight your skills, education, and projects in a professional format that stands out to employers.
          </p>

        </div>

        <Card className="mb-10 fade-in-up animate-delay-100">
          <CardContent className="p-6">
            <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-1 md:grid-cols-5 mb-8 w-full">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                <p className="mb-6 text-gray-600">
                  This information will be displayed at the top of your resume. Make sure to include accurate contact details.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={resumeData.firstName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Enter your first name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={resumeData.lastName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Enter your last name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={resumeData.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="your.email@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={resumeData.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="+880 1749498717" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="linkedIn">LinkedIn Profile (Optional)</Label>
                    <Input 
                      id="linkedIn" 
                      value={resumeData.linkedIn}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://linkedin.com/in/yourprofile" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea 
                      id="summary" 
                      value={resumeData.summary}
                      onChange={handlePersonalInfoChange}
                      placeholder="Write a brief professional summary..." 
                      rows={4} 
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    style={{ backgroundColor: "#F6C500", color: "#000000" }}
                    onClick={handleSavePersonalInfo}
                  >
                    Save & Continue
                  </Button>
                </div>
              </TabsContent>
              
              {/* Education Tab */}
              <TabsContent value="education" className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Education</h2>
                <p className="mb-6 text-gray-600">
                  Add your educational background, starting with the most recent. Include relevant coursework and achievements.
                </p>
                
                {resumeData.education.map((education, index) => (
                  <Card key={index} className="mb-6 border-dashed">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Education #{index + 1}</h3>
                        {resumeData.education.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => removeEducation(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${index}`}>Institution Name</Label>
                          <Input 
                            id={`institution-${index}`} 
                            value={education.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="University or College Name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${index}`}>Degree / Program</Label>
                          <Input 
                            id={`degree-${index}`} 
                            value={education.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            placeholder="B.Sc, M.Sc, Diploma, etc." 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                          <Input 
                            id={`startDate-${index}`} 
                            type="month" 
                            value={education.startDate}
                            onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`endDate-${index}`}>End Date (or Expected)</Label>
                          <Input 
                            id={`endDate-${index}`} 
                            type="month" 
                            value={education.endDate}
                            onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`relevantCourses-${index}`}>Relevant Coursework (Optional)</Label>
                          <Input 
                            id={`relevantCourses-${index}`} 
                            value={education.relevantCourses}
                            onChange={(e) => handleEducationChange(index, 'relevantCourses', e.target.value)}
                            placeholder="List relevant courses separated by commas" 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`achievements-${index}`}>Achievements / Activities (Optional)</Label>
                          <Textarea 
                            id={`achievements-${index}`} 
                            value={education.achievements}
                            onChange={(e) => handleEducationChange(index, 'achievements', e.target.value)}
                            placeholder="Describe your academic achievements, clubs, or activities..." 
                            rows={3} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  style={{ backgroundColor: "#FFFBEA", color: "#000000", border: "1px dashed #F6C500" }} 
                  className="w-full mb-6"
                  onClick={addEducation}
                >
                  <i className="fas fa-plus mr-2"></i> Add Another Education
                </Button>
                
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("personal")}
                  >
                    Previous: Personal Info
                  </Button>
                  <Button 
                    style={{ backgroundColor: "#F6C500", color: "#000000" }}
                    onClick={handleSaveEducation}
                  >
                    Save & Continue
                  </Button>
                </div>
              </TabsContent>
              
              {/* Experience Tab */}
              <TabsContent value="experience" className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Experience</h2>
                <p className="mb-6 text-gray-600">
                  Add your work experience, internships, or volunteer work. For students, include projects or part-time jobs.
                </p>
                
                {resumeData.experience.map((experience, index) => (
                  <Card key={index} className="mb-6 border-dashed">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
                        {resumeData.experience.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => removeExperience(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`company-${index}`}>Company / Organization</Label>
                          <Input 
                            id={`company-${index}`} 
                            value={experience.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            placeholder="Company or Organization Name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`position-${index}`}>Position / Title</Label>
                          <Input 
                            id={`position-${index}`} 
                            value={experience.position}
                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                            placeholder="Your job title" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`expStartDate-${index}`}>Start Date</Label>
                          <Input 
                            id={`expStartDate-${index}`} 
                            type="month" 
                            value={experience.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`expEndDate-${index}`}>End Date (or Present)</Label>
                          <Input 
                            id={`expEndDate-${index}`} 
                            type="month" 
                            value={experience.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Textarea 
                            id={`description-${index}`} 
                            value={experience.description}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities, achievements, and skills used..." 
                            rows={4} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  style={{ backgroundColor: "#FFFBEA", color: "#000000", border: "1px dashed #F6C500" }} 
                  className="w-full mb-6"
                  onClick={addExperience}
                >
                  <i className="fas fa-plus mr-2"></i> Add Another Experience
                </Button>
                
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("education")}
                  >
                    Previous: Education
                  </Button>
                  <Button 
                    style={{ backgroundColor: "#F6C500", color: "#000000" }}
                    onClick={handleSaveExperience}
                  >
                    Save & Continue
                  </Button>
                </div>
              </TabsContent>
              
              {/* Skills Tab */}
              <TabsContent value="skills" className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Skills</h2>
                <p className="mb-6 text-gray-600">
                  List your technical skills, soft skills, languages, and any relevant certifications.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Your Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input 
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          placeholder="Enter a skill (e.g., JavaScript, Project Management)" 
                        />
                        {resumeData.skills.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800 flex-shrink-0" 
                            onClick={() => removeSkill(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="mt-4"
                    style={{ backgroundColor: "#FFFBEA", color: "#000000", border: "1px dashed #F6C500" }} 
                    onClick={addSkill}
                  >
                    <i className="fas fa-plus mr-2"></i> Add Skill
                  </Button>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("experience")}
                  >
                    Previous: Experience
                  </Button>
                  <Button 
                    style={{ backgroundColor: "#F6C500", color: "#000000" }}
                    onClick={handleSaveSkills}
                  >
                    Save & Continue
                  </Button>
                </div>
              </TabsContent>
              
              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-4">
                
                <h2 className="text-2xl font-bold mb-4">Resume Preview</h2>
                <p className="mb-6 text-gray-600">
                  Preview your resume and make any final adjustments before downloading.
                </p>
                
                
                <div ref={previewRef} className="bg-gray-100 p-8 border rounded-lg mb-6 overflow-auto max-h-[800px]">
                  <div 
                    id="resume-to-print" 
                    className={`mx-auto max-w-[800px] shadow-xl ${selectedTemplate}-template print:shadow-none`}
                    style={{ 
                      width: '21cm', 
                      minHeight: '29.7cm', 
                      backgroundColor: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Display the selected template with resume data */}
                    <ATSTemplate data={resumeData} />

                    
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
  {/* Left-aligned button */}
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("skills")}
                >
                  Previous: Skills
                </Button>

                {/* Right-aligned buttons */}
                <div className="flex gap-4">
                  <Button 
                    disabled={isGeneratingPDF}
                    style={{ backgroundColor: "#F6C500", color: "#000000" }}
                    onClick={handleGeneratePDF}
                  >
                    {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                  </Button>
                  <Button 
                    onClick={handleSaveResumeToServer} 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? "Saving..." : "Save Resume"}
                  </Button>
                </div>
              </div>

              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Resume Tips Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-up animate-delay-200">
          <Card>
            <CardContent className="p-6">
              <div className="bg-[#FFFBEA] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="fas fa-lightbulb text-[#F6C500] text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Resume Tips</h3>
              <p className="text-gray-600">
                Keep your resume to one page, use action verbs, and quantify your achievements whenever possible.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="bg-[#FFFBEA] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="fas fa-file-alt text-[#F6C500] text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">ATS Optimization</h3>
              <p className="text-gray-600">
                Use keywords from the job description to help your resume pass through Applicant Tracking Systems.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="bg-[#FFFBEA] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <i className="fas fa-check-double text-[#F6C500] text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Proofreading</h3>
              <p className="text-gray-600">
                Always proofread your resume for spelling and grammar errors. Ask a friend or mentor to review it as well.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ResumeBuilder;
