const express = require("express");
const router = express.Router();
const {
  savePortfolio,
  getPortfolio,
  getGithubPortfolio,
} = require("../controllers/portfolioController");

router.post("/save", savePortfolio);
router.get("/github/:username", getGithubPortfolio);
router.get("/:userId", getPortfolio);

module.exports = router;
