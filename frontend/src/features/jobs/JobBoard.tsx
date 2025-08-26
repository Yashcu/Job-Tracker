// src/features/jobs/JobBoard.tsx
import { useEffect, useState } from 'react';
import { getJobs, createJob, updateJob, deleteJob } from './api';
import type { IJob, JobStatus } from '@/types/job';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import JobForm from './JobForm';
import { toast } from 'react-hot-toast';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

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
      const data = await getJobs();
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
      fetchJobs();
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeJobId = String(active.id);
    const newStatus = String(over.id) as JobStatus;
    const activeJob = jobs.find(job => job._id === activeJobId);

    if (activeJob && activeJob.status !== newStatus) {
      // Optimistically update the UI
      const updatedJobs = jobs.map(job =>
        job._id === activeJobId ? { ...job, status: newStatus } : job
      );
      setJobs(updatedJobs);

      // Call API to persist the change
      updateJob(activeJobId, { status: newStatus }).catch(() => {
        toast.error("Failed to update job status.");
        // Revert UI on failure
        setJobs(jobs);
      });
    } else if (activeJob) {
      // Logic for sorting within the same column (optional)
      const oldIndex = jobsByStatus[activeJob.status].findIndex(job => job._id === activeJobId);
      const newIndex = jobsByStatus[activeJob.status].findIndex(job => job._id === String(over.id));

      if (oldIndex !== newIndex) {
        const sortedJobs = arrayMove(jobsByStatus[activeJob.status], oldIndex, newIndex);
        setJobs(prevJobs => {
          const otherJobs = prevJobs.filter(job => job.status !== activeJob.status);
          return [...otherJobs, ...sortedJobs];
        });
      }
    }
  };


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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  id={status}
                  title={status}
                  jobs={jobsByStatus[status]}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </DndContext>
        )}
      </div>
      <JobForm job={editingJob} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </Dialog>
  );
};

export default JobBoard;
