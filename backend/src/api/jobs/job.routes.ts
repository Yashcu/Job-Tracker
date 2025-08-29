// backend/src/api/jobs/job.routes.ts

import { Router } from "express";
import { createJob, getJobs, getJob, updateJob, deleteJob } from "./job.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { z } from "zod";

const router = Router();

router.use(AuthMiddleware);

const jobSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
    ctc: z.number().optional(),
});

router.route('/')
    .post(validate(jobSchema), createJob)
    .get(getJobs);

router.route('/:id')
    .get(getJob)
    .put(validate(jobSchema.partial()), updateJob)
    .delete(deleteJob);

export default router;
