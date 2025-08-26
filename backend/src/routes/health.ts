import { Router } from "express";
import { User } from "../models/User";

const router = Router();

router.get("/health",(_req,res) =>{
    res.json({
        status: "Ok"
    });
});

router.post("/health/test-user", async (_req,res) => {
    try{
        const user = new User({
            name: "Test User",
            email: `test${Date.now()}@gmail.com`,
            password: "password123",
        });
        await user.save();
        res.status(201).json({
            message: 'Test user created successfully',
            user,
        });
    }
    catch(err){
        res.status(500).json({
            message: "Failed to create user",
            error: err
        });
    }
});

export default router;