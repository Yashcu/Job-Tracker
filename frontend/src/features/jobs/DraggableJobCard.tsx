// frontend/src/features/jobs/DraggableJobCard.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JobCard from './JobCard';
import type { IJob } from '@/types/job';

interface DraggableJobCardProps {
  job: IJob;
  onEdit: (job: IJob) => void;
  onDelete: (jobId: string) => void;
}

const DraggableJobCard = (props: DraggableJobCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.job._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard {...props} />
    </div>
  );
};

export default DraggableJobCard;