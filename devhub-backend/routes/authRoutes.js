const express = require("express");
const router = express.Router();
// Controller se teeno functions ko import karein
const {
  registerUser,
  loginUser,
  verifyOTP,
} = require("../controllers/authController");

// Route path setup
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP); // Naya route add kiya

module.exports = router;
