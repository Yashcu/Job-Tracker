// src/features/jobs/JobCard.tsx
import type { IJob } from '../../types/job';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

interface JobCardProps {
  job: IJob;
  onEdit: (job: IJob) => void;
  onDelete: (jobId: string) => void;
}

const JobCard = ({ job, onEdit, onDelete }: JobCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview': return 'bg-blue-500';
      case 'Offer': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{job.role}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Applied: {new Date(job.createdAt).toLocaleDateString()}
          </p>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(job)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(job._id)}>Delete</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;