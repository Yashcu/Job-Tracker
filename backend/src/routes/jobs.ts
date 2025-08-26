import { Router } from "express";
import { createJob, getjobs, getJob, updateJob, deleteJob } from "../controllers/jobController";
import { AuthMiddleware } from "../middleware/auth";

const router = Router();

router.post('/',AuthMiddleware, createJob);
router.get('/',AuthMiddleware, getjobs);
router.get('/:id', AuthMiddleware, getJob);
router.put('/:id',AuthMiddleware, updateJob);
router.delete('/:id',AuthMiddleware, deleteJob);

export default router;

