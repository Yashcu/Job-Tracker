// frontend/src/features/jobs/components/EmptyState.tsx
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  status: string;
}

const EmptyState = ({ status }: EmptyStateProps) => {
  const messages: Record<string, string> = {
    Applied:
      "You haven't applied to any jobs yet. Click 'Add New Job' to get started!",
    Interview: "No interviews scheduled. Move a job here when you land one!",
    Offer: "No offers yet. Keep going, you're doing great!",
    Rejected: "No rejections here. A clear board is a good sign!",
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
        <PlusCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{messages[status]}</p>
    </div>
  );
};

export default EmptyState;
