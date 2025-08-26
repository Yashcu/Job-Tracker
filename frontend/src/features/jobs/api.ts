// src/features/jobs/api.ts
import api from '../../lib/axios';
import type { IJob } from '../../types/job';

// The backend `getjobs` function fetches all jobs for the user
export const getJobs = async (status?: string): Promise<IJob[]> => {
  const params = status ? { status } : {};
  const response = await api.get('/jobs', { params });
  return response.data;
};

// The backend `createJob` function creates a new job
export const createJob = async (jobData: Omit<IJob, '_id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// The backend `updateJob` function updates an existing job
export const updateJob = async (jobId: string, jobData: Partial<IJob>) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data;
};

// The backend `deleteJob` function deletes a job
export const deleteJob = async (jobId: string) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};