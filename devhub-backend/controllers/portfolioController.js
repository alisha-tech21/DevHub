const githubApi = require("../utils/githubApi");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");

exports.getGithubPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    const portfolio = await Portfolio.findOne({
      githubUsername: username,
    }).populate("userId");

    let ownerEmail = null;

    if (portfolio && portfolio.userId) {
      ownerEmail = portfolio.userId.email;
    }
    // 2. GitHub se data fetch
    const [userRes, reposRes, eventsRes] = await Promise.allSettled([
      githubApi.get(`/users/${username}`),
      githubApi.get(`/users/${username}/repos?per_page=100`),
      githubApi.get(`/users/${username}/events/public?per_page=10`),
    ]);

    if (userRes.status === "rejected" || !userRes.value?.data) {
      return res.status(404).json({ message: "GitHub user not found" });
    }
    const userData = userRes.value.data;
    const repos = reposRes.status === "fulfilled" ? reposRes.value.data : [];
    const events = eventsRes.status === "fulfilled" ? eventsRes.value.data : [];

    // Top Repos logic
    const sortedRepos = [...repos].sort(
      (a, b) => b.stargazers_count - a.stargazers_count,
    );

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

    res.json({
      name: userData.name || userData.login,
      username: userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio,
      followers: userData.followers,
      publicRepos: userData.public_repos,
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      languages: [...new Set(repos.map((r) => r.language).filter(Boolean))],
      repos: repos.map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        topics: r.topics || [],
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

// Portfolio Fetch
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio" });
  }
};
