import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import BlogGrid from "../components/BlogGrid";
import CTASection from "../components/CTASection";
import { Link } from "react-router-dom";

function Home({ onFetchGithub, loading }) {
  const [blogs, setBlogs] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* HeroSection ko direct onFetchGithub mil raha hai */}
      <HeroSection onGenerate={onFetchGithub} loading={loading} />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Trending Blogs</h2>
          <Link to="/blogs" className="text-indigo-400 hover:text-indigo-300">
            View All →
          </Link>
        </div>
        <BlogGrid blogs={blogs.slice(0, 3)} />
      </section>

      <CTASection />
    </div>
  );
}

export default Home;
