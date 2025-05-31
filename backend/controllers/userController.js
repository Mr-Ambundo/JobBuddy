import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find user by userId
        const user = await User.findOne({userId}).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Update user profile
export const updateUser = async (req, res) => {
    const { userId } = req.params;
  
    // Only allow users to update their own profile
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized profile update" });
    }
  
    try {
      const updateFields = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        skills: req.body.skills,
        experience: req.body.experience,
        education: req.body.education,
      };
  
      // You can also allow employers to update more fields if needed
      if (req.user.role === "employer") {
        updateFields.company = req.body.company;
        updateFields.position = req.body.position;
        updateFields.bio = req.body.bio;
        updateFields.location = req.body.location;
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { userId },
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select("-password");
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update failed:", error);
      res.status(500).json({ message: "Server error during update" });
    }
  };
  