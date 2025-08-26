import mongoose, { Document, Schema, Types } from "mongoose";

export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export interface IJob extends Document {
    user: Types.ObjectId;
    company: string;
    role: string;
    status: JobStatus;
    salary?: number;
    link?: string;
    notes?: string;
}

const jobSchema = new Schema<IJob>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        company: { type: String, required: true },
        role: { type: String, required: true },
        status: {
            type: String,
            enum: ["Applied", "Interview", "Offer", "Rejected"],
            default: "Applied",
        },
        salary: Number,
        link: String,
        notes: String,
    },
    { timestamps: true }
);

export const Job = mongoose.model<IJob>("Job", jobSchema);