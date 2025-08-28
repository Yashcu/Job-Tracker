import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState } from "react";
import type { IJob } from "@/types/job";

// Define a type for the context that will be passed down to child routes like JobBoard
export interface DashboardContextType {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingJob?: IJob;
  setEditingJob: (job?: IJob) => void;
}

export default function DashboardLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<IJob | undefined>(undefined);

  const handleAddNewJob = () => {
    setEditingJob(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar onAddNewJob={handleAddNewJob} />
      <main className="flex-1 overflow-y-auto">
        <Outlet
          context={{ isModalOpen, setIsModalOpen, editingJob, setEditingJob }}
        />
      </main>
    </div>
  );
}
