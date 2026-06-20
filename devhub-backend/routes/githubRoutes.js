const express = require("express");
const router = express.Router();
const { getGithubPortfolio } = require("../controllers/portfolioController");

router.get("/profile/:username", getGithubPortfolio);

module.exports = router;
