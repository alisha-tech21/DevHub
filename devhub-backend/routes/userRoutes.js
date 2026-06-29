const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  updateProfile,
  changePassword,
  uploadAvatar,
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const demoMode = require("../middleware/demoMode");

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  verifyToken,
  demoMode,
  upload.single("image"),
  uploadAvatar,
);
router.put("/update/:id", verifyToken, demoMode, updateProfile);
module.exports = router;
