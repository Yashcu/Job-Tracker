import { Request, Response } from "express";
import mongoose from "mongoose";
import { Job, JobStatus } from "../models/Job";

//Get Status Distribution
export const getStatusCounts = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user!.userId);

        const counts = await Job.aggregate([
            { $match: { user: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const result = counts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {} as Record<JobStatus, number>);

        res.json(result);
    }
    catch (err) {
        console.error("GET STATUS COUNTS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch status counts", message: err.message });
    }
};

// Get Trends over time
// GET /api/analytics/trends
export const getTrends = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user!.userId);

        const trends = await Job.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(trends);
    } catch (err) {
        console.error("GET TRENDS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch trends", message: err.message });
    }
};