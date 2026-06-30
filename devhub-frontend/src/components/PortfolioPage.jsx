import React, { useContext, useEffect, useState, useRef } from "react";
import { GitHubCalendar } from "react-github-calendar";
import {
  FaStar,
  FaCodeBranch,
  FaUsers,
  FaSearch,
  FaDownload,
  FaShareAlt,
  FaCode,
  FaCircle,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-[#05070B] border border-neutral-500 p-4 text-center min-w-[100px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer">
    {" "}
    <div className="flex justify-center text-cyan-400 mb-1">{icon}</div>
    <h3 className="text-xl font-bold">{value}</h3>
    <p className="text-[10px] text-neutral-500 uppercase">{title}</p>
  </div>
);

const getRelativeTime = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffInDays < 1) return "Updated today";
  if (diffInDays < 7) return `Updated ${diffInDays} days ago`;
  if (diffInDays < 30) return `Updated ${Math.floor(diffInDays / 7)} weeks ago`;
  return `Updated on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
};

const getLangColor = (lang) => {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    "C#": "#178600",
    HTML: "#e34c26",
    CSS: "#563d7c",
  };
  return colors[lang] || "#fff";
};

function PortfolioPage({ githubData, onFetchGithub, loading }) {
  const portfolioRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const API_URL = import.meta.env.VITE_API_URL;
  const handleDownload = useReactToPrint({
    contentRef: portfolioRef,
    documentTitle: `${githubData?.username || "portfolio"}-portfolio`,
  });
  const handleScrollToSearch = () => {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
      searchBar.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const loadSavedPortfolio = async () => {
      if (user && !githubData) {
        try {
          const res = await fetch(`${API_URL}/api/portfolio/${user._id}`);
          const data = await res.json();
          if (data?.githubUsername) onFetchGithub(data.githubUsername);
        } catch (err) {
          console.log("No saved portfolio found");
        }
      }
    };
    loadSavedPortfolio();
  }, [user, githubData, onFetchGithub]);

  const saveMyPortfolio = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/api/portfolio/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          githubUsername: githubData.username,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        toast.success("Portfolio saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to save portfolio.");
    }
  };
  const handleShare = async () => {
    const url = `https://github.com/${githubData.username}`;

    if (navigator.share) {
      await navigator.share({
        title: `${githubData.name}'s Portfolio`,
        text: "Check out this developer portfolio",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);

      toast.success("Portfolio link copied!", {
        style: {
          background: "#171717",
          color: "#fff",
          border: "1px solid #404040",
        },
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-500 font-bold">
        Loading...
      </div>
    );

  if (!githubData)
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center px-4">
        <Toaster position="bottom-right" />
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800 shadow-lg">
          <FaSearch className="text-cyan-500 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          No Portfolio Data
        </h2>
        <p className="text-neutral-400 mb-6 text-center max-w-sm">
          It looks like you haven't searched for a GitHub profile or saved one
          yet.
        </p>
        <button
          onClick={handleScrollToSearch}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-md font-bold"
        >
          Go to Search
        </button>
      </div>
    );
  useEffect(() => {
    console.log("GitHub Data received:", githubData);
  }, [githubData]);

  useEffect(() => {
    const checkSaved = async () => {
      if (!user || !githubData?.username) return;

      const res = await fetch(`${API_URL}/api/portfolio/${user._id}`);

      const data = await res.json();

      if (data?.githubUsername === githubData.username) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    };

    checkSaved();
  }, [user, githubData]);
  return (
    <div ref={portfolioRef}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="bg-black min-h-screen text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative"
      >
        <Toaster position="bottom-right" />
        <div className="max-w-7xl mx-auto">
          {/* TOP SECTION */}
          <div className="border border-neutral-500 bg-[#05070B] p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {" "}
              <img
                src={githubData.avatar}
                alt="Profile"
                className="w-28 h-28 sm:w-36 sm:h-36 lg:w-45 lg:h-45 object-cover border border-neutral-700"
              />
              <div className="flex-1">
                <h1 className="text-4xl mt-2 font-bold">{githubData.name}</h1>
                <p className="text-neutral-400 mt-3 text-sm leading-6 max-w-xl">
                  {githubData.bio || "No bio available"}
                </p>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() =>
                      window.open(
                        `https://github.com/${githubData.username}`,
                        "_blank",
                      )
                    }
                    className="bg-cyan-600 hover:bg-cyan-700 hover:scale-105 hover:shadow-lg transition-all duration-300 text-white px-6 py-2 text-sm font-bold cursor-pointer"
                  >
                    Follow
                  </button>

                  {/* Save Logic Button */}
                  {user && (
                    <button
                      onClick={saveMyPortfolio}
                      disabled={isSaved}
                      className={`border px-6 py-2 text-sm font-bold rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer ${
                        isSaved
                          ? "bg-green-600 border-green-600 cursor-not-allowed"
                          : "border-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/30"
                      }`}
                    >
                      {isSaved ? "Saved ✓" : "Save as My Portfolio"}
                    </button>
                  )}

                  {/* Message Button */}
                  <button
                    onClick={() => {
                      // Login nahi hai
                      if (!user) {
                        navigate("/login", {
                          state: { from: window.location.pathname },
                        });
                        return;
                      }

                      if (githubData?.ownerEmail) {
                        window.location.href = `mailto:${githubData.ownerEmail}`;
                      }
                    }}
                    disabled={user && !githubData?.ownerEmail}
                    className={`px-6 py-2 text-sm rounded-md transition-all duration-300 ${
                      user && !githubData?.ownerEmail
                        ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                        : "border border-neutral-500 text-white hover:bg-neutral-800 hover:scale-105 cursor-pointer"
                    }`}
                  >
                    {user
                      ? githubData?.ownerEmail
                        ? "Message"
                        : "Not on DevHub"
                      : "Message"}
                  </button>
                </div>
              </div>
              <div className="ml-auto self-start flex flex-col items-end">
                {/* Download + Share */}

                <div className="flex gap-3 mb-10 print:hidden">
                  <button
                    title="Download Portfolio (PDF)"
                    onClick={handleDownload}
                    className="w-11 h-11 rounded-lg border border-neutral-700 hover:border-cyan-500 hover:bg-neutral-900 flex items-center justify-center transition"
                  >
                    <FaDownload />
                  </button>

                  <button
                    title="Share Portfolio"
                    onClick={handleShare}
                    className="w-11 h-11 rounded-lg border border-neutral-700 hover:border-cyan-500 hover:bg-neutral-900 flex items-center justify-center transition"
                  >
                    <FaShareAlt />
                  </button>
                </div>

                {/* Stats */}

                <div className="flex gap-3">
                  <StatCard
                    title="Stars"
                    value={githubData.stars}
                    icon={<FaStar size={14} />}
                  />

                  <StatCard
                    title="Repos"
                    value={githubData.publicRepos}
                    icon={<FaCodeBranch size={14} />}
                  />

                  <StatCard
                    title="Followers"
                    value={githubData.followers}
                    icon={<FaUsers size={14} />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 space-y-6 order-2 lg:order-1">
              {" "}
              <div className="bg-[#05070B] border border-neutral-500 p-6">
                <h3 className="text-cyan-400 font-bold mb-5 text-sm">
                  TECH STACK
                </h3>
                <div className="flex flex-col gap-3">
                  {githubData.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="w-fit border border-neutral-400 px-3 py-1 text-sm transition-all duration-300 hover:border-cyan-500 hover:scale-105 hover:bg-neutral-900 hover:shadow-md"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              {/* Activities Section */}
              <div className="bg-[#05070B] border border-neutral-500 p-5">
                <h3 className="text-cyan-400 font-bold mb-4 text-sm">
                  RECENT ACTIVITIES
                </h3>
                <div className="space-y-3">
                  {githubData.activities?.map((act, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-neutral-400 border-b border-neutral-500 pb-2"
                    >
                      {act.type} in{" "}
                      <span className="text-white">{act.repo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-3 space-y-6 order-1 lg:order-2">
              {" "}
              <div className="flex justify-end mb-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#05070B] border border-neutral-600 px-4 py-2 rounded-lg"
                >
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                  <option value="updated">Recently Updated</option>
                  <option value="name">A-Z</option>
                </select>
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Search repository..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#05070B] border border-neutral-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <h2 className="text-2xl font-bold">Top Repositories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {githubData.repos
                  ?.filter((repo) =>
                    repo.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .sort((a, b) => {
                    if (sortBy === "stars") return b.stars - a.stars;

                    if (sortBy === "forks") return b.forks - a.forks;

                    if (sortBy === "updated")
                      return new Date(b.updated_at) - new Date(a.updated_at);

                    return a.name.localeCompare(b.name);
                  })
                  .map((repo) => (
                    <div
                      key={repo.name}
                      onClick={() => window.open(repo.url, "_blank")}
                      className="group bg-[#05070B] border border-neutral-700 rounded-lg p-5 cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
                    >
                      <h3 className="text-cyan-400 text-xl font-bold hover:underline truncate">
                        {repo.name}
                      </h3>
                      <p className="text-neutral-400 mt-4 min-h-[70px] leading-6 text-sm">
                        {repo.description || "No description"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getLangColor(repo.language),
                            }}
                          />
                          {repo.language || "Unknown"}
                        </div>

                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          {repo.stars || 0}
                        </div>

                        <div className="flex items-center gap-1">
                          <FaCodeBranch className="text-cyan-400" />
                          {repo.forks || 0}
                        </div>

                        <div className="ml-auto text-xs text-neutral-500">
                          {getRelativeTime(repo.updated_at)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="bg-[#05070B] border border-neutral-500 p-6">
                <h2 className="text-xl font-bold mb-4">Annual Contributions</h2>
                <GitHubCalendar
                  username={githubData.username}
                  blockSize={13}
                  blockMargin={4}
                  fontSize={14}
                  hideMonthLabels={false}
                  theme={{
                    light: [
                      "#161B22",
                      "#0E4429",
                      "#006D32",
                      "#26A641",
                      "#39D353",
                    ],
                    dark: [
                      "#161B22",
                      "#0E4429",
                      "#006D32",
                      "#26A641",
                      "#39D353",
                    ],
                  }}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PortfolioPage;
