import express from 'express';
import { apply, getApplicationsForTarget, updateApplicationStatus } from '../controllers/applicationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Jobseekers apply
router.post('/', authMiddleware, apply);

// Employers / Mentors view applicants
router.get('/:id', authMiddleware, getApplicationsForTarget);

// Employers / Mentors update applicant status
router.put('/status/:id', authMiddleware, updateApplicationStatus);

export default router;
