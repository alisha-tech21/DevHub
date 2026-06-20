const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  getTrendingTags,
} = require("../controllers/blogController"); // Controller import karein
const authMiddleware = require("../middleware/authMiddleware");

router.get("/trending-tags", getTrendingTags);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", authMiddleware, createBlog);

module.exports = router;
