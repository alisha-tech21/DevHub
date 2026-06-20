import React, { useContext, useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { FaStar, FaCodeBranch, FaUsers, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

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
          const res = await fetch(
            `http://localhost:8000/api/portfolio/${user._id}`,
          );
          const data = await res.json();
          if (data?.githubUsername) onFetchGithub(data.githubUsername);
        } catch (err) {
          console.log("No saved portfolio found");
        }
      }
    };
    loadSavedPortfolio();
  }, [user, githubData, onFetchGithub]);
  const handleMessage = async () => {
    try {
      const githubUsername = githubData?.username || savedGithubUser;

      console.log("Sending username:", githubUsername);

      const res = await fetch(
        `http://localhost:8000/api/github/${githubUsername}`,
      );

      const data = await res.json();

      if (!data.ownerEmail) {
        toast.error("This user is not linked to a DevHub account.", {
          style: {
            background: "#171717",
            color: "#fff",
            border: "1px solid #404040",
          },
        });
        return;
      }

      window.location.href = `mailto:${data.ownerEmail}`;
    } catch (err) {
      console.error(err);
      toast.error("Message failed");
    }
  };
  const saveMyPortfolio = async () => {
    if (!user) return;

    try {
      const res = await fetch("http://localhost:8000/api/portfolio/save", {
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
        {/* Yeh line wapas add kar dein jo design mein thi */}
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

      const res = await fetch(
        `http://localhost:8000/api/portfolio/${user._id}`,
      );

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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="bg-black min-h-screen text-white px-8 py-10 relative"
    >
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto">
        {/* TOP SECTION */}
        <div className="border border-neutral-500 bg-[#05070B] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={githubData.avatar}
              alt="Profile"
              className="w-45 h-45 object-cover border border-neutral-700"
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

                {/* Message Button - Hamesha clickable */}
                <button
                  onClick={() => {
                    if (!user) {
                      // Not logged in → redirect to login with return path
                      navigate("/login", {
                        state: { from: window.location.pathname },
                      });
                      return;
                    }

                    if (githubData?.ownerEmail) {
                      // Email available → open mail client
                      window.location.href = `mailto:${githubData.ownerEmail}`;
                    } else {
                      // Logged in but no email linked
                      toast.error(
                        "This user is not registered on DevHub or has no email available.",
                        {
                          style: {
                            background: "#171717",
                            color: "#fff",
                            border: "1px solid #404040",
                          },
                        },
                      );
                    }
                  }}
                  className="border border-neutral-500 px-6 py-2 text-sm text-white hover:bg-neutral-800 hover:scale-105 transition-all duration-300 rounded-md cursor-pointer"
                >
                  Message
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-22">
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

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#05070B] border border-neutral-500 p-5">
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
                    {act.type} in <span className="text-white">{act.repo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-bold">Top Repositories</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {githubData.repos?.map((repo) => (
                <div
                  key={repo.name}
                  onClick={() => window.open(repo.url, "_blank")}
                  className="bg-[#05070B] border border-neutral-500 p-5 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <h3 className="text-cyan-400 text-xl font-bold">
                    {repo.name}
                  </h3>
                  <p className="text-neutral-400 mt-4 min-h-[60px] text-sm">
                    {repo.description || "No description"}
                  </p>
                  <div className="flex items-center gap-4 mt-6 text-[11px] text-neutral-500">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getLangColor(repo.language) }}
                    ></span>
                    {repo.language || "N/A"}
                    <div>{getRelativeTime(repo.updated_at)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#05070B] border border-neutral-500 p-6">
              <h2 className="text-xl font-bold mb-4">Annual Contributions</h2>
              <GitHubCalendar username={githubData.username} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PortfolioPage;
