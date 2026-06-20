const Blog = require("../models/Blog");

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email",
    );
    if (!blog)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new blog article
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags, readTime, imageUrl } = req.body;

    // Auth middleware se milne wali user ID ka use karein
    const authorId = req.user.id;

    const blog = await Blog.create({
      title,
      content,
      tags,
      readTime,
      imageUrl: imageUrl || "https://via.placeholder.com/800",
      author: authorId, // <--- Yahan se ID secure hogi
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all blogs for the home timeline
exports.getAllBlogs = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = {};

    if (tag) {
      const tagsArray = tag.split(",");

      query = {
        tags: {
          $in: tagsArray.map((t) => new RegExp(`^${t}$`, "i")),
        },
      };
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getTrendingTags = async (req, res) => {
  try {
    const trendingTags = await Blog.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      data: trendingTags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
