// frontend/src/features/jobs/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { getJobs, createJob as apiCreateJob, updateJob as apiUpdateJob, deleteJob as apiDeleteJob } from '../api';
import type { IJob } from '@/types/job';

const useJobs = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['jobs', page, limit], () => getJobs(page, limit), {
        keepPreviousData: true,
    });

  const createJob = useMutation(apiCreateJob, {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });

  // Updated 'updateJob' mutation with feedback
  const updateJob = useMutation(apiUpdateJob, {
    onSuccess: () => {
      toast.success('Job status updated!');
      queryClient.invalidateQueries('jobs');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update job.');
      // Revert to the server state if the update fails
      queryClient.invalidateQueries('jobs');
    }
  });

  const deleteJob = useMutation(apiDeleteJob, {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });

  const setJobs = (newJobs: IJob[]) => {
    queryClient.setQueryData('jobs', newJobs);
  };

  return { jobs: data?.jobs || [], totalPages: data?.totalPages || 1, currentPage: data?.currentPage || 1, isLoading, createJob, updateJob, deleteJob, setJobs };
};

export default useJobs;
