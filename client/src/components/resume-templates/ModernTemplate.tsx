import React from 'react';

interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  relevantCourses?: string;
  achievements?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  level?: number;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface ResumeData {
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

interface ModernTemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  // Format date string (YYYY-MM) to display as Mon YYYY
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Present';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg" id="resume-to-print">
      {/* Header / Contact Info */}
      <header className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          {data.firstName} {data.lastName}
        </h1>
        <div className="text-gray-600 flex flex-wrap gap-y-1 gap-x-4">
          <span>{data.email}</span>
          <span>•</span>
          <span>{data.phone}</span>
          {data.linkedIn && (
            <>
              <span>•</span>
              <span>{data.linkedIn}</span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 border-b pb-1">Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
                <span className="text-gray-600 text-sm">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-gray-700">{edu.degree}</p>
              {edu.relevantCourses && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">Relevant Coursework:</span> {edu.relevantCourses}
                </p>
              )}
              {edu.achievements && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">Achievements:</span> {edu.achievements}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{exp.company}</h3>
                <span className="text-gray-600 text-sm">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-700 font-medium">{exp.position}</p>
              <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                <span className="text-gray-600 text-sm">{formatDate(cert.date)}</span>
              </div>
              <p className="text-gray-600 text-sm">Issuer: {cert.issuer}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;