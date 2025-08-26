import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/authController";
import { AuthMiddleware } from "../middleware/auth";

const router = Router();

router.get("/me",AuthMiddleware, getMe);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;