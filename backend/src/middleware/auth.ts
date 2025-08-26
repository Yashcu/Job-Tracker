import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        if(typeof decoded === 'object' && decoded.userId){
            req.user = { userId : decoded.userId };
            next();
        }
        else{
            throw new Error("Invalid token payload");
        }
    }
    catch(err){
        console.error("Authentication error:", err);
        return res.status(403).json({
            message: "Invalid or expired Token",
        });
    }
};