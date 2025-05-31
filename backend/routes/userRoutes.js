import express from "express";
import { getUserById, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/:userId", authMiddleware, getUserById);
router.put("/:userId", authMiddleware, updateUser);

export default router;