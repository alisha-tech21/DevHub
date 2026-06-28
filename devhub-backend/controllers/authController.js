const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({
          message: "Email is already registered",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      userExists.otp = otp;
      userExists.otpExpires = Date.now() + 3 * 60 * 1000;

      await userExists.save();

      console.log("Resending OTP to:", email);

      try {
        await sendEmail({ email, otp });

        return res.status(200).json({
          message: "New OTP sent to your email.",
          email,
        });
      } catch (err) {
        console.error("Resend OTP Error:", err);
        return res.status(500).json({
          message: "Failed to send OTP. Please try again.",
        });
      }
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 3 * 60 * 1000;

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });
    console.log("Attempting to send email to:", email);
    // 5. Send OTP Email
    try {
      await sendEmail({ email, otp });
    } catch (err) {
      await User.findByIdAndDelete(user._id);
      throw err;
    }
    console.log("Email function executed successfully");

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "User doesn't exist" });
    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      techStack: user.techStack,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
