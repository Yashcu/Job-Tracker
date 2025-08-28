// frontend/src/features/jobs/api.ts
import api from '../../lib/axios';
import type { IJob } from '../../types/job';

export const getJobs = async (): Promise<IJob[]> => {
  const response = await api.get('/jobs');
  return response.data;
};

export const createJob = async (jobData: Omit<IJob, '_id' | 'createdAt' | 'updatedAt'>): Promise<IJob> => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// UPDATED: Now accepts a single object
export const updateJob = async (jobData: Partial<IJob> & { _id: string }): Promise<IJob> => {
  const { _id, ...dataToUpdate } = jobData;
  const response = await api.put(`/jobs/${_id}`, dataToUpdate);
  return response.data;
};

export const deleteJob = async (jobId: string): Promise<void> => {
  await api.delete(`/jobs/${jobId}`);
};
