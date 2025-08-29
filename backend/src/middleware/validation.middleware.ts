// backend/src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Invalid request body",
                    errors: error.flatten().fieldErrors,
                });
            }
            next(error);
        }
    };
};
