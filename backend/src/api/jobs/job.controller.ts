import { Request, Response } from "express";
import { Job } from "../../models/Job";

//Create job
export const createJob = async (req: Request, res: Response) => {
    try {
        const job = await Job.create({ ...req.body, user: req.user!.userId });
        res.status(201).json(job);
    }
    catch (err) {
        console.error("CREATE JOB ERROR", err);
        res.status(500).json({ error: "Failed to create job" });
    }
};

//Get one Job
export const getJob = async (req: Request, res: Response) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user!.userId,
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    } catch (err) {
        console.error("GET JOB ERROR:", err);
        res.status(500).json({ error: "Failed to fetch job" });
    }
};

// Get All jobs
export const getJobs = async (req: Request, res: Response) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter: any = { user: req.user!.userId };

        if (status) {
            filter.status = status;
        }

        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalJobs = await Job.countDocuments(filter);

        res.json({
            jobs,
            totalPages: Math.ceil(totalJobs / Number(limit)),
            currentPage: Number(page),
        });
    } catch (err) {
        console.error("GET JOBS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

// Update Job
export const updateJob = async (req: Request, res: Response) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, user: req.user!.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!job) return res.status(404).json({
            message: "Job not found",
        });
        res.json(job);
    }
    catch (err) {
        console.error("UPDATE JOB ERROR:", err);
        res.status(500).json({ error: "Failed to update job" });
    }
};

//Delete Job
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.user!.userId
        });
        if (!job) return res.status(404).json({
            message: "Job not found",
        });
        res.json({
            message: "Job deleted"
        });
    }
    catch (err) {
        console.error("DELETE JOB ERROR:", err);
        res.status(500).json({ error: "Failed to delete job" });
    }
};

