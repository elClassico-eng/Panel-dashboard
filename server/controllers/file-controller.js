const User = require("../models/user-models");

class FileController {
    async uploadAvatar(req, res) {
        try {
            const file = req.file;
            if (!file)
                return res.status(400).json({ message: "File not found" });

            const filePath = `/images/${file.filename}`;

            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { profilePhoto: filePath },
                { new: true }
            );

            if (!updatedUser)
                return res.status(400).json({ message: "User not found" });

            return res.json({
                message: "Avatar has been uploaded",
                filePath,
                user: updatedUser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new FileController();
