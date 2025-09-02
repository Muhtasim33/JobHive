import React from 'react';
import { ResumeData } from './index';

interface ATSTemplateProps {
  data: ResumeData;
}

const ATSTemplate: React.FC<ATSTemplateProps> = ({ data }) => {
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
    <div className="bg-white p-8 shadow-lg rounded-lg font-sans" id="resume-to-print">
      {/* Header - Simple and clean */}
      <header className="mb-6 text-left">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          {data.firstName} {data.lastName}
        </h1>
        <div className="text-gray-700">
          {data.email && <p>{data.email}</p>}
          {data.phone && <p>{data.phone}</p>}
          {data.linkedIn && <p>{data.linkedIn}</p>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900">Professional Summary</h2>
          <p className="text-gray-700 text-justify">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-900">{exp.position}</h3>
              <p className="text-gray-700 italic">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              <p className="text-gray-700">{exp.company}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700 italic">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </p>
              <p className="text-gray-700">{edu.institution}</p>
              {edu.relevantCourses && <p className="text-gray-700">Relevant Courses: {edu.relevantCourses}</p>}
              {edu.achievements && <p className="text-gray-700">Achievements: {edu.achievements}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900">Skills</h2>
          <ul className="list-disc pl-5 text-gray-700">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
};

export default ATSTemplate;
