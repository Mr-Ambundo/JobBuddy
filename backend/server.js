// Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
//import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:5173'];
// Middleware
app.use(express.json());
app.use(cors({
    origin: allowedOrigins, // Explicitly allow frontend origin
    credentials: true, // Allow cookies & authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Routes
app.use("/api/auth", authRoutes);   // Handles login & register
app.use("/api/users", userRoutes);  // Handles user-related operations
//app.use("/api/users/products", productRoutes);  // Handles product-related operations
app.use("/api/admin", adminRoutes); //Handles admin routes
app.use("/api/jobs", jobRoutes); //Handles job postings. 
app.use("/api/applications", applicationRoutes); //Handles applications by the jobseeker.
app.use("/api/notifications", notificationRoutes); //Handles notifications to the user. 

 
// Default route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
