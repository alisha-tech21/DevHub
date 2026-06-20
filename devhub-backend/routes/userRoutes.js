const express = require("express");
const router = express.Router();
const multer = require("multer"); // Multer import zaroori hai

// Controller functions ko ek hi baar import karein
const {
  updateProfile,
  changePassword,
  uploadAvatar,
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");

// Multer setup (agar aapne server.js mein nahi kiya hai)
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/upload", upload.single("image"), uploadAvatar);
router.put("/update/:id", verifyToken, updateProfile);

module.exports = router;
