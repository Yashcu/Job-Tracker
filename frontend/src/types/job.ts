// src/types/job.ts
export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export interface IJob {
  _id: string;
  company: string;
  role: string;
  status: JobStatus;
  ctc?: number;
  createdAt: string;
  updatedAt: string;
}
