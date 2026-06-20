import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function CommandPalette({ isOpen, onClose, blogs = [] }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredBlogs = useMemo(() => {
    if (!query) return blogs;

    return blogs.filter((blog) =>
      blog?.title?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, blogs]);

  const handleSelect = (blog) => {
    if (!blog?._id) return; // 🔥 safety check

    onClose();
    setQuery("");

    // 🔥 FIX: correct navigation
    navigate(`/blogs/${blog._id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-start pt-32 z-[9999]">
      <div className="w-[600px] bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden">
        {/* INPUT */}
        <input
          type="text"
          value={query}
          autoFocus
          placeholder="Search articles..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredBlogs.length > 0) {
              handleSelect(filteredBlogs[0]); // first result
            }

            if (e.key === "Escape") {
              onClose();
            }
          }}
          className="w-full p-3 bg-transparent text-white outline-none border-b border-neutral-800"
        />

        {/* RESULTS */}
        <div className="max-h-80 overflow-y-auto">
          {filteredBlogs.length === 0 ? (
            <p className="p-4 text-sm text-neutral-500">No blogs found</p>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => handleSelect(blog)}
                className="p-3 hover:bg-neutral-800 cursor-pointer transition"
              >
                <p className="text-white text-sm font-medium">{blog.title}</p>

                <p className="text-xs text-neutral-500">
                  {blog.tags?.join(", ")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
