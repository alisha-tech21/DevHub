import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function BlogLayout({
  children,
  onFilterChange,
  selectedFilters = [],
  onSubscribe,
}) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [trendingTags, setTrendingTags] = useState([]);
  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const res = await fetch("${API_URL}/api/blogs/trending-tags");
        const data = await res.json();

        if (data.success) {
          setTrendingTags(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrendingTags();
  }, []);
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[250px_1fr_300px] gap-8">
      {/* Left Sidebar */}
      <aside className="hidden md:block space-y-8">
        <div>
          <h3 className="text-sm font-bold text-neutral-500 uppercase mb-4">
            Tech Stack Filters
          </h3>
          <div className="space-y-2 text-sm">
            {["React", "Python", "JavaScript", "Rust", "Go", "TypeScript"].map(
              (tech) => (
                <label
                  key={tech}
                  className="flex items-center space-x-2 text-neutral-300 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(tech)}
                    onChange={() => onFilterChange(tech)} // Filter trigger
                    className="accent-blue-500 bg-neutral-900 border-neutral-700"
                  />
                  <span>{tech}</span>
                </label>
              ),
            )}
          </div>
        </div>
        <div className="bg-[#09090B] p-5 rounded border border-neutral-800">
          <h3 className="font-bold text-white mb-2">Build Together</h3>
          <p className="text-neutral-400 text-xs mb-4">
            Join our engineering community and share your knowledge.
          </p>
          <button
            onClick={() => navigate("/write")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition-colors cursor-pointer"
          >
            Start Writing
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0">{children}</main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block space-y-8">
        <div>
          <h3 className="text-sm font-bold text-neutral-500 uppercase mb-4">
            Trending Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <span
                key={tag._id}
                onClick={() => onFilterChange(tag._id)}
                className="text-xs bg-neutral-900 px-2 py-1 border border-neutral-700 text-neutral-300 rounded cursor-pointer hover:border-blue-500"
              >
                #{tag._id} ({tag.count})
              </span>
            ))}
          </div>
        </div>
        <div className="bg-[#09090B] p-5 rounded border border-neutral-800">
          <h3 className="font-bold text-white mb-2">DevHub Weekly</h3>
          <p className="text-neutral-400 text-xs mb-4">
            Curated engineering stories delivered to your inbox every Friday.
          </p>
          <input
            type="email"
            placeholder="dev@example.com"
            onChange={(e) => {
              // Subscribe ke liye yahan email state capture karein
            }}
            className="w-full bg-black border border-neutral-700 p-2 mb-2 text-sm text-white"
          />
          <button
            onClick={onSubscribe} // Subscribe trigger
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition-colors"
          >
            Subscribe
          </button>
        </div>
      </aside>
    </div>
  );
}

export default BlogLayout;
