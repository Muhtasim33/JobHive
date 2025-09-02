import React from 'react';
import { ResumeData } from './index';

interface AcademicTemplateProps {
  data: ResumeData;
}

const AcademicTemplate: React.FC<AcademicTemplateProps> = ({ data }) => {
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
    <div className="bg-white p-8 shadow-lg rounded-lg font-serif" id="resume-to-print">
      {/* Academic Header - Formal and traditional */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          {data.firstName} {data.lastName}
        </h1>
        <div className="text-gray-700 flex flex-wrap justify-center gap-y-1 gap-x-4">
          {data.email && <span>{data.email}</span>}
          {data.phone && (
            <>
              <span>•</span>
              <span>{data.phone}</span>
            </>
          )}
          {data.linkedIn && (
            <>
              <span>•</span>
              <span>{data.linkedIn}</span>
            </>
          )}
        </div>
      </header>

      {/* Education - Emphasized in academic resume */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-1">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                <span className="text-gray-700 italic">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="font-semibold text-gray-800 mb-2">{edu.institution}</p>
              {edu.relevantCourses && (
                <div className="text-gray-700 mb-2">
                  <h4 className="font-semibold text-gray-800">Relevant Coursework:</h4>
                  <p>{edu.relevantCourses}</p>
                </div>
              )}
              {edu.achievements && (
                <div className="text-gray-700">
                  <h4 className="font-semibold text-gray-800">Academic Achievements:</h4>
                  <p>{edu.achievements}</p>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Professional Summary - Academic focus */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-1">
            Research Interests & Profile
          </h2>
          <p className="text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Experience - Academic context */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-1">
            Research & Teaching Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-gray-700 italic">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <p className="font-semibold text-gray-800 mb-2">{exp.company}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills - Academic and research skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-1">
            Areas of Expertise
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            {data.skills.map((skill, index) => (
              <li key={index} className="mb-1">{skill.name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications - Academic context */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-1">
            Certifications & Professional Development
          </h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <span className="text-gray-700 italic">{formatDate(cert.date)}</span>
              </div>
              <p className="text-gray-700">{cert.issuer}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default AcademicTemplate;