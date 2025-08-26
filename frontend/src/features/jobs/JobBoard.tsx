// src/features/jobs/JobBoard.tsx
import { useEffect, useState } from 'react';
import { getJobs, createJob, updateJob, deleteJob } from './api';
import type { IJob, JobStatus } from '../../types/job';
import JobCard from './JobCard';
import { Button } from '../../components/ui/button';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import JobForm from './JobForm';
import { toast } from 'react-hot-toast';

const STATUSES: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

const JobBoard = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<IJob | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobs(); // Fetch all jobs
      setJobs(data);
    } catch (err) {
      toast.error('Failed to fetch jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingJob) {
        await updateJob(editingJob._id, data);
        toast.success('Job updated successfully!');
      } else {
        await createJob(data);
        toast.success('Job created successfully!');
      }
      fetchJobs(); // Refetch all jobs to show the new/updated one
      setIsModalOpen(false);
      setEditingJob(undefined);
    } catch (error) {
      toast.error('Failed to save job.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const openEditModal = (job: IJob) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (jobId: string) => {
      if(window.confirm("Are you sure you want to delete this job?")) {
          try {
              await deleteJob(jobId);
              toast.success("Job deleted!");
              fetchJobs();
          } catch(err) {
              toast.error("Failed to delete job.");
          }
      }
  }

  const jobsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = jobs.filter((job) => job.status === status);
    return acc;
  }, {} as Record<JobStatus, IJob[]>);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">My Job Pipeline</h2>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingJob(undefined)}>Add New Job</Button>
          </DialogTrigger>
        </div>

        {isLoading ? (
          <p>Loading your job board...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATUSES.map((status) => (
              <div key={status} className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold mb-4">{status} ({jobsByStatus[status].length})</h3>
                <div className="space-y-4">
                  {jobsByStatus[status].map((job) => (
                    <JobCard key={job._id} job={job} onEdit={openEditModal} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <JobForm job={editingJob} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </Dialog>
  );
};

export default JobBoard;