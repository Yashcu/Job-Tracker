// frontend/src/features/jobs/KanbanColumn.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableJobCard from '@/features/jobs/DraggableJobCard';
import type { IJob } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface KanbanColumnProps {
  id: string;
  title: string;
  jobs: IJob[];
  onEdit: (job: IJob) => void;
  onDelete: (jobId: string) => void;
}

const KanbanColumn = ({ id, title, jobs, onEdit, onDelete }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Card className="bg-muted p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-400">
          {jobs.length}
        </Badge>
      </CardHeader>
      <div ref={setNodeRef} className="mt-4 min-h-[100px] space-y-4">
        <SortableContext items={jobs.map(j => j._id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <DraggableJobCard key={job._id} job={job} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>
      </div>
    </Card>
  );
};

export default KanbanColumn;
