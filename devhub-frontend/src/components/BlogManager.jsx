import React, { useState } from "react";
import BlogGrid from "./BlogGrid"; // Aapka purana grid component
import BlogPage from "./BlogPage"; // Aapka single blog component

function BlogManager({ blogs }) {
  const [view, setView] = useState("grid"); // 'grid' ya 'post'
  const [activeBlog, setActiveBlog] = useState(null);

  const handleBlogClick = (blog) => {
    setActiveBlog(blog);
    setView("post");
  };

  if (view === "post" && activeBlog) {
    return (
      <div className="relative">
        <button
          onClick={() => setView("grid")}
          className="fixed top-24 left-6 text-neutral-400 hover:text-white z-50"
        >
          ← Back to Feed
        </button>
        <BlogPage blog={activeBlog} />
      </div>
    );
  }

  return <BlogGrid blogs={blogs} onBlogClick={handleBlogClick} />;
}

export default BlogManager;
