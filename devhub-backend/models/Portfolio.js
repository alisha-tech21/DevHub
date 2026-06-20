const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubUsername: { type: String, required: true },
    // Yahan aap GitHub se aaya hua extra data bhi save kar sakte hain
  },

  { timestamps: true },
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
