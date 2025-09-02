export { default as ATSTemplate } from './ATSTemplate.tsx';

// Common interface for resume data
export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  relevantCourses?: string;
  achievements?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level?: number;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn?: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications?: Certification[];
}

// Template type definitions - add 'ats' to the TemplateType
export type TemplateType = 'ats';

export interface TemplatePreview {
  id: TemplateType;
  name: string;
  imageUrl: string;
  description: string;
}

// Available templates - only include the ATS template
export const availableTemplates: TemplatePreview[] = [
  {
    id: 'ats',
    name: 'ATS Friendly',
    imageUrl: 'https://images.unsplash.com/photo-1620315073838-7a54d7c5e121?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    description: 'Optimized for Applicant Tracking Systems with clean structure and keyword-rich content.'
  }
];