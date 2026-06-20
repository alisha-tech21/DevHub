const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 1. Profile Update Logic
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, techStack } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        bio,
        avatar,
        techStack,
      },
      { new: true },
    );
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Cloudinary se mili hui path URL bhej rahe hain
  res.status(200).json({ imageUrl: req.file.path });
};
