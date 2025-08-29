// backend/src/api/auth/auth.routes.ts

import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", AuthMiddleware, getMe);

export default router;
