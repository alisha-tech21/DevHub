const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    githubUsername: {
      type: String,
      required: false,
      trim: true,
    },
    bio: { type: String, default: "MERN Stack Developer" },
    techStack: { type: [String], default: [] },
    // Naya field add karein
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
