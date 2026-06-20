const axios = require("axios");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");

exports.getGithubPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Database se user email dhundein
    const portfolio = await Portfolio.findOne({
      githubUsername: username,
    }).populate("userId");

    let ownerEmail = null;

    if (portfolio && portfolio.userId) {
      ownerEmail = portfolio.userId.email;
    }
    // 2. GitHub se data fetch karein
    const [userRes, reposRes, eventsRes] = await Promise.allSettled([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`),
      axios.get(
        `https://api.github.com/users/${username}/events/public?per_page=10`,
      ),
    ]);

    // Agar user hi nahi mila toh 404 bhejein
    if (userRes.status === "rejected" || !userRes.value?.data) {
      return res.status(404).json({ message: "GitHub user not found" });
    }
    const userData = userRes.value.data;
    const repos = reposRes.status === "fulfilled" ? reposRes.value.data : [];
    const events = eventsRes.status === "fulfilled" ? eventsRes.value.data : [];

    // Top Repos logic
    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Activities logic
    const uniqueActivities = [];
    const seenRepos = new Set();
    for (const event of events) {
      const repoName = event.repo.name.split("/")[1];
      if (!seenRepos.has(repoName)) {
        uniqueActivities.push({
          type: event.type,
          repo: repoName,
          url: `https://github.com/${event.repo.name}`,
        });
        seenRepos.add(repoName);
      }
      if (uniqueActivities.length === 3) break;
    }

    // 3. Final Response bhejein
    res.json({
      name: userData.name || userData.login,
      username: userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio,
      followers: userData.followers,
      publicRepos: userData.public_repos,
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      languages: [...new Set(repos.map((r) => r.language).filter(Boolean))],
      repos: topRepos.map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
        updated_at: r.pushed_at,
        url: r.html_url,
      })),
      activities: uniqueActivities,
      ownerEmail,
    });
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ message: "Server error during fetch" });
  }
};
exports.savePortfolio = async (req, res) => {
  const { userId, githubUsername } = req.body;
  try {
    let portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { githubUsername },
      { new: true, upsert: true },
    );
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error saving portfolio" });
  }
};

// Portfolio Fetch karna
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio" });
  }
};
