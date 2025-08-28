// backend/src/server.ts
import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";

import authRoutes from './api/auth/auth.routes';
import jobRoutes from './api/jobs/job.routes';
import analyticsRoute from './api/analytics/analytics.routes'

dotenv.config();

const PORT = process.env.PORT || 3000
const app = express();
app.use(express.json());

const clientURL = process.env.CLIENT_URL;

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || (clientURL && origin.startsWith(clientURL))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

//API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/analytics', analyticsRoute);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
