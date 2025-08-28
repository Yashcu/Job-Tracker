// backend/src/api/auth/auth.routes.ts
import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", AuthMiddleware, getMe);

export default router;
