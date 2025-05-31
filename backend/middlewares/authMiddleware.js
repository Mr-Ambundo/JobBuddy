import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure correct path
import Job from "../models/job.js";

// General authentication middleware
export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB to get full details
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        // Check if the user is deactivated
        if (user.status === "deactivated") {
            return res.status(403).json({ message: "Your account has been deactivated." });
        }
        
        req.user = user; // Now req.user contains full user info
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const jobOwnerMiddleware = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Compare job.employer with the logged-in user's id
        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You do not own this job post." });
        }

        req.job = job; // optionally pass job forward
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// Jobseeker middleware
export const seekerMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "seeker") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Job seekers only" });
    }
};

// Employer middleware
export const employerMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "employer") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Employers only" });
    }
};

// mentor middleware
export const mentorMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "mentor") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Mentors only" });
    }
};
