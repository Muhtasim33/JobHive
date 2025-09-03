import { API_BASE } from '../config';

export const getAppliedJobs = async (jobSeekerId: number) => {
  const res = await fetch(`${API_BASE}/api/job-seeker/${jobSeekerId}/applied-jobs`);
  if (!res.ok) throw new Error("Failed to fetch applied jobs");
  return await res.json();
};





export const saveJob = async (seekerId: number, jobId: number) => {
  const res = await fetch(`${API_BASE}/api/job-seeker/${seekerId}/save/${jobId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error("Failed to save job");
  return await res.json();
};

export const getSavedJobs = async (seekerId: number) => {
  const res = await fetch(`${API_BASE}/api/job-seeker/${seekerId}/saved-jobs`);
  if (!res.ok) throw new Error("Failed to fetch saved jobs");
  return await res.json();
};