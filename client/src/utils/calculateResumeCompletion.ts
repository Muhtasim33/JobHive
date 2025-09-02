export const calculateResumeCompletion = (resume: any): number => {
  if (!resume) return 0;

  const fields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "linkedIn",
    "summary",
    "education",
    "experience",
    "skills",
    "certifications"
  ];

  const filled = fields.filter((field) => {
    const value = resume[field];
    return Array.isArray(value) ? value.length > 0 : !!value;
  });

  return Math.round((filled.length / fields.length) * 100);
};
