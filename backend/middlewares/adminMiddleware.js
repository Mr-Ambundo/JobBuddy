
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admins only" });
    }
};

export const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = false;
        await user.save();

        // TODO: Send notification to the user about deactivation
        res.status(200).json({ message: "User has been deactivated successfully." });
    } catch (error) {
        console.error("Deactivation Error:", error);
        res.status(500).json({ message: "Error deactivating user", error: error.message });
    }
};

