import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";

import healthRoutes from './routes/health'
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import analyticsRoute from './routes/analytics'

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true
}));

app.use(cookieParser());
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/analytics', analyticsRoute);

const startServer = async () => {
    try{
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });        
    }
    catch(error){
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

