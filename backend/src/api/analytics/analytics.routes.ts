// backend/src/api/analytics/analytics.routes.ts
import { Router } from "express";
import { getStatusCounts, getTrends } from "./analytics.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(AuthMiddleware);

router.get("/status", getStatusCounts);
router.get("/trends", getTrends);

export default router;
