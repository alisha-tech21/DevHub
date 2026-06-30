import React, { useContext, useEffect, useState, useRef } from "react";
import { GitHubCalendar } from "react-github-calendar";
import {
  FaStar,
  FaCodeBranch,
  FaUsers,
  FaSearch,
  FaDownload,
  FaShareAlt,
  FaSortAmountDown,
  FaChevronDown,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { ThemeContext } from "../context/ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";

const StatCard = ({ title, value, icon, theme }) => (
  <div
    className="p-4 text-center min-w-[100px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
    style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      color: theme.text,
    }}
  >
    <div className="flex justify-center mb-1" style={{ color: theme.accent }}>
      {icon}
    </div>

    <h3 className="text-xl font-bold">{value}</h3>

    <p className="text-[10px] uppercase" style={{ color: theme.muted }}>
      {title}
    </p>
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
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [repoLimit] = useState(6);
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
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: theme.background,
          color: theme.text,
        }}
      >
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
          className="px-8 py-3 rounded-md font-bold"
          style={{
            background: theme.button,
            color: theme.buttonText,
          }}
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
        className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative transition-colors duration-300"
        style={{
          background: theme.background,
          color: theme.text,
        }}
      >
        <Toaster position="bottom-right" />
        <div className="max-w-7xl mx-auto">
          {/* TOP SECTION */}
          <div
            className="border p-6 mb-6 transition-colors duration-300"
            style={{
              background: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {" "}
              <img
                src={githubData.avatar}
                alt="Profile"
                className="w-28 h-28 sm:w-36 sm:h-36 lg:w-45 lg:h-45 object-cover border border-neutral-700"
              />
              <div className="flex-1">
                <h1 className="text-4xl mt-2 font-bold">{githubData.name}</h1>
                <p
                  className="mt-3 text-sm leading-6 max-w-xl"
                  style={{
                    color: theme.muted,
                  }}
                >
                  {" "}
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
                    className="px-6 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      background: theme.button,
                      color: theme.buttonText,
                    }}
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
                      style={{
                        background: isSaved ? "#16A34A" : theme.button,
                        color: theme.buttonText,
                        border: `1px solid ${theme.button}`,
                      }}
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
                    className={`px-6 py-2 text-sm rounded-md transition-all duration-300 hover:opacity-90 ${
                      user && !githubData?.ownerEmail
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    style={{
                      background:
                        user && !githubData?.ownerEmail
                          ? theme.hover
                          : theme.surface,

                      color:
                        user && !githubData?.ownerEmail
                          ? theme.muted
                          : theme.text,

                      border: `1px solid ${theme.border}`,
                    }}
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
                  <ThemeSwitcher />

                  <button
                    title="Download Portfolio (PDF)"
                    onClick={handleDownload}
                    className="w-11 h-11 border flex justify-center items-center transition"
                    style={{
                      background: theme.surface,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <FaDownload />
                  </button>

                  <button
                    title="Share Portfolio"
                    onClick={handleShare}
                    className="w-11 h-11 border flex justify-center items-center transition"
                    style={{
                      background: theme.surface,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
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
                    theme={theme}
                  />

                  <StatCard
                    title="Repos"
                    value={githubData.publicRepos}
                    icon={<FaCodeBranch size={14} />}
                    theme={theme}
                  />

                  <StatCard
                    title="Followers"
                    value={githubData.followers}
                    icon={<FaUsers size={14} />}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 space-y-6 order-2 lg:order-1">
              {" "}
              <div
                className="border p-6 transition-all duration-300"
                style={{
                  background: theme.surface,
                  borderColor: theme.border,
                }}
              >
                {" "}
                <h3
                  className="font-bold tracking-widest text-xs mb-6"
                  style={{ color: theme.accent }}
                >
                  TECH STACK
                </h3>
                <div className="flex flex-wrap gap-3">
                  {" "}
                  {githubData.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="
inline-flex
items-center
gap-2
px-4
py-2
text-sm
font-medium
transition-all
duration-300
hover:-translate-y-1
"
                      style={{
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getLangColor(lang) }}
                      />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              {/* Activities Section */}
              <div
                className="p-6"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {" "}
                <h3
                  className="font-bold tracking-widest text-xs mb-6"
                  style={{ color: theme.accent }}
                >
                  {" "}
                  RECENT ACTIVITIES
                </h3>
                <div className="space-y-4">
                  {githubData.activities?.length ? (
                    githubData.activities.map((act, i) => (
                      <a
                        key={i}
                        href={act.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-4 transition-all duration-300 hover:-translate-y-1"
                        style={{
                          background: theme.card,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{
                              color: theme.accent,
                            }}
                          >
                            {" "}
                            {act.type.replace("Event", "")}
                          </span>
                          <FaCodeBranch
                            style={{
                              color: theme.muted,
                            }}
                          />{" "}
                        </div>

                        <p
                          className="mt-3 text-sm font-medium truncate"
                          style={{ color: theme.text }}
                        >
                          {" "}
                          {act.repo}
                        </p>

                        <p
                          className="mt-1 text-xs"
                          style={{ color: theme.muted }}
                        >
                          {" "}
                          View repository →
                        </p>
                      </a>
                    ))
                  ) : (
                    <p
                      className="text-sm"
                      style={{
                        color: theme.muted,
                      }}
                    >
                      {" "}
                      No recent public activity.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-3 space-y-6 order-1 lg:order-2">
              {" "}
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                {" "}
                <div className="relative flex-1 min-w-[240px] group">
                  {" "}
                  <FaSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition"
                    style={{
                      color: theme.muted,
                    }}
                  />{" "}
                  <input
                    type="text"
                    placeholder="Search by repository name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
            w-full
            h-12
            border
            rounded-xl
            pl-11
            pr-4
            placeholder:text-neutral-500
            portfolio-search
            transition-all
            duration-300
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20
            outline-none
        "
                    style={{
                      background: theme.input,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                  />
                </div>
                <div className="relative w-full md:w-72 group">
                  {" "}
                  <FaSortAmountDown
                    className="
absolute
left-4
top-1/2
-transform
-translate-y-1/2
text-cyan-400
text-sm
pointer-events-none
"
                  />{" "}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="
    w-full
    h-12
    appearance-none
    rounded-xl
    border
    pl-11
    pr-12
    text-sm
    font-medium
    cursor-pointer
    transition-all
    duration-300
    hover:border-cyan-500
    focus:border-cyan-500
    focus:ring-2
    focus:ring-cyan-500/20
    outline-none
  "
                    style={{
                      background: theme.input,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <option value="stars">⭐ Most Stars</option>
                    <option value="forks">🍴 Most Forks</option>
                    <option value="updated">🕒 Recently Updated</option>
                    <option value="name">🔤 Alphabetical</option>
                  </select>
                  <FaChevronDown
                    className="
absolute
right-4
top-1/2
-transform
-translate-y-1/2
pointer-events-none
"
                    style={{
                      color: theme.muted,
                    }}
                  />{" "}
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">
                  {showAllRepos
                    ? `All Repositories (${githubData.repos.length})`
                    : `Pinned Repositories`}
                </h2>

                {githubData.repos.length > repoLimit && (
                  <button
                    onClick={() => setShowAllRepos(!showAllRepos)}
                    className="
inline-flex
items-center
gap-2
text-cyan-400
font-semibold
transition-all
duration-300
hover:text-cyan-300
hover:gap-3
cursor-pointer
"
                    style={{
                      color: theme.accent,
                    }}
                  >
                    {showAllRepos ? "Show Less" : "View all →"}
                  </button>
                )}
              </div>
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
                  .slice(0, showAllRepos ? githubData.repos.length : repoLimit)

                  .map((repo) => (
                    <div
                      key={repo.name}
                      onClick={() => window.open(repo.url, "_blank")}
                      className="
group
rounded-none
p-5
cursor-pointer
transition-all
duration-300
hover:-translate-y-2
"
                      style={{
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <h3
                        className="text-xl font-bold hover:underline truncate"
                        style={{
                          color: theme.accent,
                        }}
                      >
                        {" "}
                        {repo.name}
                      </h3>
                      <p
                        className="mt-4 min-h-[70px] leading-6 text-sm"
                        style={{
                          color: theme.muted,
                        }}
                      >
                        {" "}
                        {repo.description || "No description"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-neutral-400">
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1"
                          style={{
                            background: theme.surface,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          {" "}
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

                        <div
                          className="ml-auto text-xs"
                          style={{
                            color: theme.muted,
                          }}
                        >
                          {" "}
                          {getRelativeTime(repo.updated_at)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div
                className="p-6"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {" "}
                <h2 className="text-xl font-bold mb-4">Annual Contributions</h2>
                <GitHubCalendar
                  username={githubData.username}
                  blockSize={13}
                  blockMargin={4}
                  fontSize={14}
                  hideMonthLabels={false}
                 theme={
  theme.mode === "dark"
    ? {
        dark: [
          theme.card,
          theme.hover,
          theme.accent,
          "#22c55e",
          "#16a34a",
        ],
      }
    : {
        light: [
          "#ebedf0",
          "#9be9a8",
          "#40c463",
          "#30a14e",
          "#216e39",
        ],
      }
}
                  }
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
