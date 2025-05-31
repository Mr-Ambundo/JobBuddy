import express from "express";
import { authMiddleware, employerMiddleware, jobOwnerMiddleware } from '../middlewares/authMiddleware.js';
import { createJob, updateJob, getJobById, getJobs, deleteJob } from "../controllers/jobController.js";
const router = express.Router()

router.post('/', authMiddleware, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById); // 👈 this line handles GET /jobs/:id
router.put('/:id', authMiddleware, employerMiddleware, jobOwnerMiddleware, updateJob);
router.delete('/:id', authMiddleware, employerMiddleware, jobOwnerMiddleware, deleteJob);

export default router;