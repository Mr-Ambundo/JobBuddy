import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid" });
        }

        console.log("Admin Found:", admin); // Debugging step

        // Compare hashed password
        const ismatch = password == admin.password;
        if (!ismatch) {
            console.log(`Password mismatch! -:> ${password} : ${admin.password}`); // Debugging step
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        res.json({ admin, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
