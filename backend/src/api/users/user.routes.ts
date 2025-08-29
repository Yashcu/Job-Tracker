import { Router } from "express";
import { updateUser } from "./user.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { z } from "zod";

const router = Router();

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
});

router.put("/me", AuthMiddleware, validate(updateUserSchema), updateUser);

export default router;
