// backend/src/api/jobs/job.routes.ts
import { Router } from "express";
import { createJob, getJobs, getJob, updateJob, deleteJob } from "./job.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(AuthMiddleware);

router.route('/')
    .post(createJob)
    .get(getJobs);

router.route('/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deleteJob);

export default router;
