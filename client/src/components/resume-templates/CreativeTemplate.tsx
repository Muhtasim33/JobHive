import React from 'react';
import { ResumeData } from './index';

interface CreativeTemplateProps {
  data: ResumeData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
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

  // Function to determine the CSS width based on skill level (1-5)
  const getSkillLevelWidth = (level: number | undefined): string => {
    if (!level) return '60%';
    const percentage = Math.min(Math.max((level / 5) * 100, 20), 100);
    return `${percentage}%`;
  };

  return (
    <div className="flex flex-col md:flex-row h-full print:flex-row print:overflow-hidden">
      {/* Sidebar - Creative color accent with skills and contact info */}
      <div className="bg-[#FFDC5E] text-gray-900 p-6 md:w-1/3 print:w-1/3">
        <div className="sticky top-0">
          {/* Profile Section */}
          <div className="mb-8 text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
              <span className="text-4xl font-bold">
                {data.firstName.charAt(0)}{data.lastName.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">{data.firstName} {data.lastName}</h1>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-800 pb-1">
              Contact
            </h2>
            <ul className="space-y-2">
              {data.email && (
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm break-words">{data.email}</span>
                </li>
              )}
              {data.phone && (
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{data.phone}</span>
                </li>
              )}
              {data.linkedIn && (
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 10.172a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101" />
                  </svg>
                  <span className="text-sm break-words">{data.linkedIn}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Skills Section with visual bars */}
          {data.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-800 pb-1">
                Skills
              </h2>
              <ul className="space-y-3">
                {data.skills.map((skill, index) => (
                  <li key={index} className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5">
                      <div 
                        className="bg-gray-800 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: getSkillLevelWidth(skill.level) }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
            <div>
              <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-800 pb-1">
                Certifications
              </h2>
              {data.certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  {cert.name && (
                    <>
                      <h3 className="font-medium text-base">{cert.name}</h3>
                      <div className="text-sm">
                        {cert.issuer && <p>{cert.issuer}</p>}
                        {cert.date && <p className="italic">{formatDate(cert.date)}</p>}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 md:w-2/3 print:w-2/3">
        {/* Summary Section */}
        {data.summary && (
          <section className="mb-8 section">
            <h2 className="text-lg font-bold uppercase mb-4 text-[#FFB800] border-b pb-1">
              About Me
            </h2>
            <p className="text-gray-700">{data.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && data.experience[0].company && (
          <section className="mb-8 section">
            <h2 className="text-lg font-bold uppercase mb-4 text-[#FFB800] border-b pb-1">
              Experience
            </h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-5 section-item">
                {exp.company && (
                  <>
                    <div className="flex flex-wrap justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-gray-600 text-sm">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="font-semibold text-[#FFB800] mb-2">{exp.company}</p>
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  </>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education Section */}
        {data.education.length > 0 && data.education[0].institution && (
          <section className="section">
            <h2 className="text-lg font-bold uppercase mb-4 text-[#FFB800] border-b pb-1">
              Education
            </h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-5 section-item">
                {edu.institution && (
                  <>
                    <div className="flex flex-wrap justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-gray-600 text-sm">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="font-semibold text-[#FFB800] mb-2">{edu.institution}</p>
                    
                    {(edu.relevantCourses || edu.achievements) && (
                      <div className="text-gray-700 text-sm">
                        {edu.relevantCourses && (
                          <p className="mb-1"><span className="font-medium">Relevant Courses:</span> {edu.relevantCourses}</p>
                        )}
                        {edu.achievements && (
                          <p><span className="font-medium">Achievements:</span> {edu.achievements}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;