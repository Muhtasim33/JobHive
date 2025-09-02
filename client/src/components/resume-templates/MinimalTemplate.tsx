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

interface MinimalTemplateProps {
  data: ResumeData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
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
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto" id="resume-to-print">
      {/* Header / Contact Info */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 uppercase tracking-widest">
          {data.firstName} {data.lastName}
        </h1>
        <div className="text-gray-600 text-sm flex justify-center flex-wrap gap-x-3">
          <span>{data.email}</span>
          <span>|</span>
          <span>{data.phone}</span>
          {data.linkedIn && (
            <>
              <span>|</span>
              <span>{data.linkedIn}</span>
            </>
          )}
        </div>
      </header>

      {/* Horizontal Line */}
      <hr className="border-t border-gray-300 my-4" />

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg uppercase font-semibold mb-2 text-gray-800 tracking-wider">Profile</h2>
          <p className="text-gray-700 text-sm">{data.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg uppercase font-semibold mb-3 text-gray-800 tracking-wider">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-sm">{edu.institution}</h3>
                <span className="text-gray-600 text-sm">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{edu.degree}</p>
              {edu.relevantCourses && (
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-medium">Coursework:</span> {edu.relevantCourses}
                </p>
              )}
              {edu.achievements && (
                <p className="text-gray-600 text-xs mt-1">
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
          <h2 className="text-lg uppercase font-semibold mb-3 text-gray-800 tracking-wider">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-sm">{exp.position}</h3>
                <span className="text-gray-600 text-sm">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{exp.company}</p>
              <p className="text-gray-600 text-xs mt-1">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg uppercase font-semibold mb-3 text-gray-800 tracking-wider">Skills</h2>
          <p className="text-gray-700 text-sm">
            {data.skills.map(skill => skill.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-lg uppercase font-semibold mb-3 text-gray-800 tracking-wider">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-sm">{cert.name}</h3>
                <span className="text-gray-600 text-sm">{formatDate(cert.date)}</span>
              </div>
              <p className="text-gray-600 text-xs">Issuer: {cert.issuer}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;