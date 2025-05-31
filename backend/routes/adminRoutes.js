import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import { deactivateUser } from "../middlewares/adminMiddleware.js";
import { getUserById } from "../controllers/userController.js";

const router = express.Router();

// Admin Login Route
router.post("/login", loginAdmin);
router.put("/deactivate/:userId", deactivateUser, getUserById);


export default router;
