import React from 'react';
import { ResumeData } from './index';

interface ProfessionalTemplateProps {
  data: ResumeData;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ data }) => {
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
      {/* Header / Contact Info - Professional style with border and centered */}
      <header className="mb-6 text-center border-b-2 border-gray-900 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-gray-900">
          {data.firstName} {data.lastName}
        </h1>
        <div className="text-gray-700 flex flex-wrap justify-center gap-y-1 gap-x-4">
          {data.email && <span>{data.email}</span>}
          {data.phone && (
            <>
              <span className="hidden md:inline">|</span>
              <span>{data.phone}</span>
            </>
          )}
          {data.linkedIn && (
            <>
              <span className="hidden md:inline">|</span>
              <span>{data.linkedIn}</span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary - Clean and formal */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-900 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-justify">{data.summary}</p>
        </section>
      )}

      {/* Experience - Formal layout with clean typography */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 text-gray-900 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-gray-700 text-sm italic">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <p className="font-semibold text-gray-800 mb-1">{exp.company}</p>
              <p className="text-gray-700 text-sm">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education - Clean and professional format */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 text-gray-900 border-b border-gray-300 pb-1">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <span className="text-gray-700 text-sm italic">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="font-semibold text-gray-800 mb-1">{edu.institution}</p>
              {edu.relevantCourses && (
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Relevant Coursework:</span> {edu.relevantCourses}
                </p>
              )}
              {edu.achievements && (
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Academic Achievements:</span> {edu.achievements}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills - Professional layout with categorized skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 text-gray-900 border-b border-gray-300 pb-1">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {data.skills.map((skill, index) => (
              <span 
                key={index} 
                className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 text-gray-800 rounded text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications - Professional format */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase mb-3 text-gray-900 border-b border-gray-300 pb-1">
            Certifications & Licenses
          </h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <span className="text-gray-700 text-sm italic">{formatDate(cert.date)}</span>
              </div>
              <p className="text-gray-700 text-sm">Issued by: {cert.issuer}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;