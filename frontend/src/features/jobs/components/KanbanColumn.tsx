// frontend/src/features/jobs/components/KanbanColumn.tsx
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableJobCard from "./DraggableJobCard";
import type { IJob, JobStatus } from "@/types/job";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState"; // Import the new component

interface KanbanColumnProps {
  id: JobStatus;
  title: string;
  jobs: IJob[];
  onEdit: (job: IJob) => void;
  onDelete: (jobId: string) => void;
}

const statusColors: Record<JobStatus, string> = {
  Applied: "border-blue-500",
  Interview: "border-yellow-500",
  Offer: "border-green-500",
  Rejected: "border-red-500",
};

const KanbanColumn = ({
  id,
  title,
  jobs,
  onEdit,
  onDelete,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "mb-4 flex items-center justify-between border-l-4 pl-2",
          statusColors[id]
        )}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
            {jobs.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 rounded-lg bg-secondary/50 p-2 space-y-4 min-h-[300px]"
      >
        <SortableContext
          items={jobs.map((j) => j._id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <DraggableJobCard
              key={job._id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
        {jobs.length === 0 && <EmptyState status={id} />}
      </div>
    </div>
  );
};

export default KanbanColumn;
