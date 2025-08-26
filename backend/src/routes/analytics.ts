import { Router } from "express";
import { getStatusCounts, getTrends } from "../controllers/analyticsController";
import { AuthMiddleware } from "../middleware/auth";

const router = Router();

router.get("/status", AuthMiddleware, getStatusCounts);
router.get("/trends", AuthMiddleware, getTrends);

export default router;
