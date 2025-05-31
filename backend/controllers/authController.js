import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            phoneNumber, 
            dateOfBirth, 
            gender, 
            isYouth, 
            isWoman, 
            hasDisability, 
            skills, 
            experience, 
            education,
            role 
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !dateOfBirth || !gender || !skills || !experience || !education || !role) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Must be a valid user role
        if (!["jobSeeker", "employer", "mentor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'jobSeeker', 'employer', or 'mentor'" });
        }

        // Validate phone number if provided
        if (phoneNumber && !phoneNumber.startsWith('+') && !phoneNumber.startsWith('0')) {
            return res.status(400).json({ message: "Invalid phone number format. Must start with '0' or '+'" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with all provided fields
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            dateOfBirth,
            gender,
            isYouth,
            isWoman,
            hasDisability,
            skills,
            experience,
            education,
            role
        });

        // Respond with user data and token
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id),
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if the user is deactivated (if you have this field in your model)
        // if user.isActive is not in your model, you can remove this check
        if (user.isActive === false) {
            return res.status(403).json({ message: "Your account has been deactivated. Please contact support." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token with role
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Respond with user info and token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};