import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function BlogGrid({ blogs, viewType = "grid" }) {
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <section className="bg-black py-10">
      <div
        className={`mx-auto px-4 ${
          viewType === "list" ? "max-w-2xl" : "max-w-7xl"
        }`}
      >
        <div
          className={`grid gap-6 ${
            viewType === "list"
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Link
                to={`/blogs/${blog._id}`}
                className="bg-[#09090B] border border-white overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-blue-500/60"
              >
                <div className="w-full aspect-video overflow-hidden bg-neutral-900 border-b border-white">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
                    {stripHtml(blog.content).substring(0, 150)}...
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogGrid;
