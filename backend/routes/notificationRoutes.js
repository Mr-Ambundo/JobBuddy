import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User fetches their notifications
router.get('/', authMiddleware, getNotifications);

// Mark specific notification as read
router.put('/:id', authMiddleware, markAsRead);

export default router;
