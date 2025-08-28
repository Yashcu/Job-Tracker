// frontend/src/features/jobs/components/JobCard.tsx
import type { IJob } from "@/types/job";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Building, Calendar, DollarSign } from "lucide-react"; // Added DollarSign icon

interface JobCardProps {
  job: IJob;
  onEdit: (job: IJob) => void;
  onDelete: (jobId: string) => void;
}

const JobCard = ({ job, onEdit, onDelete }: JobCardProps) => {
  return (
    <Card className="bg-background cursor-grab active:cursor-grabbing">
      <CardHeader className="p-4 flex flex-row items-start justify-between">
        <CardTitle className="text-base font-semibold">{job.role}</CardTitle>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(job)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(job._id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="flex items-center text-sm text-muted-foreground mb-4">
          <Building className="mr-2 h-4 w-4 flex-shrink-0" /> {job.company}
        </CardDescription>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-3 w-3" />
            <span>Applied: {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Conditionally render the CTC */}
          {job.ctc && (
            <div className="flex items-center font-medium text-green-400">
              <DollarSign className="mr-1 h-3 w-3" />
              <span>{job.ctc} LPA</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
