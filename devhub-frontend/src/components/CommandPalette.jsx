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
    <div
      className="
      fixed inset-0
bg-black/70
flex justify-center
items-start
pt-20 sm:pt-28
px-3
z-[9999]
"
      onClick={onClose}
    >
      <div
        className="
    w-[92%]
    sm:w-[85%]
    md:w-[650px] 
   lg:w-[700px]
    max-h-[80vh]
    bg-[#0d0d0d]
    border border-neutral-800
    rounded-2xl
    overflow-hidden
  "
        onClick={(e) => e.stopPropagation()}
      >
        {/* INPUT */}
        <input
          type="text"
          value={query}
          autoFocus
          placeholder="Search blogs, tags..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredBlogs.length > 0) {
              handleSelect(filteredBlogs[0]); // first result
            }

            if (e.key === "Escape") {
              onClose();
            }
          }}
          className="
w-full
px-4
py-4
bg-transparent
text-white
outline-none
border-b border-neutral-800
text-sm sm:text-base
"
        />

        {/* RESULTS */}
        <div className="max-h-[260px] overflow-y-auto scroll-smooth">
          {filteredBlogs.length === 0 ? (
            <p className="p-4 text-sm text-neutral-500">No blogs found</p>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => handleSelect(blog)}
                className="px-4 py-4 min-h-[64px] hover:bg-neutral-800 cursor-pointer transition border-b border-neutral-900"
              >
                <p className="text-white text-sm sm:text-base font-medium truncate">
                  {blog.title}
                </p>

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
