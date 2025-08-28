import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { toast } from "react-hot-toast";
import type { IJob, JobStatus } from "@/types/job";
import useJobs from "./hooks/useJobs";
import KanbanColumn from "./components/KanbanColumn";
import JobForm from "./components/JobForm";
import { Dialog } from "@/components/ui/dialog";
import JobCard from "./components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutletContext } from "react-router-dom";
import type { DashboardContextType } from "../dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected"];

const JobBoard = () => {
  const { isModalOpen, setIsModalOpen, editingJob, setEditingJob } =
    useOutletContext<DashboardContextType>();
  const { jobs, isLoading, createJob, updateJob, deleteJob, setJobs } =
    useJobs();
  const [activeJob, setActiveJob] = useState<IJob | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt-desc");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingJob) {
        await updateJob.mutateAsync({ ...editingJob, ...data });
        toast.success("Job updated!");
      } else {
        await createJob.mutateAsync(data);
        toast.success("Job created!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save job.");
    }
  };

  const openEditModal = (job: IJob) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteJob.mutate(jobId);
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveJob(jobs.find((job: IJob) => job._id === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const originalJob = jobs.find((job: IJob) => job._id === active.id);
    const newStatus = over.id as JobStatus;

    if (originalJob && originalJob.status !== newStatus) {
      const updatedJobs = jobs.map((job: IJob) =>
        job._id === active.id ? { ...job, status: newStatus } : job
      );
      setJobs(updatedJobs);
      updateJob.mutate({ ...originalJob, status: newStatus });
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter(
        (job: IJob) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a: IJob, b: IJob) => {
        const [key, order] = sortOrder.split("-");
        const valA = a[key as keyof IJob];
        const valB = b[key as keyof IJob];

        if (valA === undefined || valB === undefined) return 0;

        let comparison = 0;
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }
        return order === "asc" ? comparison : -comparison;
      });
  }, [jobs, searchTerm, sortOrder]);

  const jobsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = filteredAndSortedJobs.filter(
      (job: IJob) => job.status === status
    );
    return acc;
  }, {} as Record<JobStatus, IJob[]>);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="container max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Job Application Pipeline
            </h1>
            <p className="text-muted-foreground mt-1">
              Drag and drop your job applications to update their status.
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest</SelectItem>
              <SelectItem value="createdAt-asc">Oldest</SelectItem>
              <SelectItem value="ctc-desc">Highest CTC</SelectItem>
              <SelectItem value="ctc-asc">Lowest CTC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATUSES.map((status) => (
              <div key={status} className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
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
            <DragOverlay dropAnimation={null}>
              {activeJob ? (
                <div style={{ transform: "scale(1.05)" }}>
                  <JobCard
                    job={activeJob}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
      <JobForm
        job={editingJob}
        onSubmit={handleFormSubmit}
        isSubmitting={createJob.isLoading || updateJob.isLoading}
      />
    </Dialog>
  );
};

export default JobBoard;
