import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Add token verification endpoint
router.get('/verify', authMiddleware, (req, res) => {
    // If middleware passes, token is valid
    res.status(200).json({ 
      valid: true, 
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      } 
    });
  });

export default router;
