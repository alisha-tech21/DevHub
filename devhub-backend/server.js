const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Routes Import
const blogRoutes = require("./routes/blogRoutes");
const githubRoutes = require("./routes/githubRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "devhub_blogs",
    format: async (req, file) => "png",
    public_id: (req, file) => Date.now().toString(),
  },
});
const upload = multer({ storage: storage });

// API Routes
app.use("/api/users", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/portfolio", require("./routes/portfolioRoutes"));

// Image Upload Route (Yahan 'upload' middleware zaroori hai)
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ imageUrl: req.file.path });
});

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/devhub")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(8000, () => console.log("Server running on port 8000"));
