const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  getTrendingTags,
} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");
const demoMode = require("../middleware/demoMode");

router.get("/trending-tags", getTrendingTags);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", authMiddleware, demoMode, createBlog);
module.exports = router;
