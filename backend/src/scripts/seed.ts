import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Job } from "../models/Job";

dotenv.config({ path: './.env' });

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB Connected for seeding...");

        // Clear existing test data
        await User.deleteMany({ email: /@test.com/ });
        await Job.deleteMany({});
        console.log("Cleared old test data.");

        // Create a test user
        const testUser = await User.create({
            name: "Test User",
            email: "test@test.com",
            password: "password123", // The model will hash this automatically
        });
        console.log("Test user created.");

        const userId = testUser._id;

        // Create sample jobs
        const jobs = [
            { user: userId, company: "Tech Solutions", role: "Frontend Developer", status: "Applied", createdAt: new Date("2024-07-15") },
            { user: userId, company: "Innovate Inc.", role: "Backend Developer", status: "Applied", createdAt: new Date("2024-07-20") },
            { user: userId, company: "Data Systems", role: "Data Analyst", status: "Interview", createdAt: new Date("2024-08-01") },
            { user: userId, company: "Web Wizards", role: "Full Stack Developer", status: "Interview", createdAt: new Date("2024-08-05") },
            { user: userId, company: "Innovate Inc.", role: "Backend Developer", status: "Offer", createdAt: new Date("2024-08-10") },
            { user: userId, company: "Creative Minds", role: "UI/UX Designer", status: "Rejected", createdAt: new Date("2024-08-12") },
            { user: userId, company: "Cloud Services", role: "DevOps Engineer", status: "Applied", createdAt: new Date("2024-08-20") },
        ];

        await Job.insertMany(jobs);
        console.log(`${jobs.length} jobs have been seeded!`);

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
};

seedDB();