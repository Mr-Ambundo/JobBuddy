import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    userId: { type: String, default: uuidv4, unique: true }, // Unique User Identifier
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String }, // Changed from Int32Array to String
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"], required: true }, // Changed to lowercase to match frontend
    isYouth: { type: Boolean, default: false },
    isWoman: { type: Boolean, default: false },
    hasDisability: { type: Boolean, default: false },
    skills: { type: String, required: true },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    role: { type: String, enum: ["employer", "jobSeeker", "mentor"], required: true }, // Changed "seeker" to "jobSeeker" to match frontend
}, { timestamps: true });

export default mongoose.model("User", userSchema);