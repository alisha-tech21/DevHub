import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getHeadings } from "../utils/getHeadings";
import { domToReact } from "html-react-parser";
import parse from "html-react-parser";
import CodeBlock from "../components/CodeBlock";
import Comments from "../components/Comments";

function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState("");

  // ----------------------------
  // 1. FETCH BLOG DATA
  // ----------------------------
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ----------------------------
  // 2. SCROLL ACTIVE HEADING
  // ----------------------------
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2, h3");
      let active = "";

      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 250) {
          active = heading.id;
          break;
        }
      }

      if (active) setActiveId(active);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----------------------------
  // 3. CONTENT PROCESSOR (SAFE)
  // ----------------------------
  const getProcessedContent = (html) => {
    if (!html) return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // 🔥 FIX: convert fake headings into real h2
    tempDiv.querySelectorAll("code").forEach((el) => {
      const text = el.innerText;

      // treat as heading if it's in list format
      if (text.length < 60) {
        const h2 = document.createElement("h2");
        h2.innerText = text;
        el.replaceWith(h2);
      }
    });

    tempDiv.querySelectorAll("h2, h3").forEach((h) => {
      h.id = h.innerText
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    });

    return tempDiv.innerHTML;
  };
  // ----------------------------
  // 4. SYNTAX HIGHLIGHT REPLACER
  // ----------------------------
  const renderOptions = {
    replace: (domNode) => {
      if (domNode.name === "pre" && domNode.children[0]) {
        const code =
          domNode.children[0].type === "text"
            ? domNode.children[0].data
            : domNode.children[0].children?.[0]?.data || "";

        return <CodeBlock code={code} />;
      }
    },
  };

  // ----------------------------
  // 5. HEADINGS (FIXED HOOK ORDER ISSUE)
  // ----------------------------
  const headings = useMemo(() => {
    if (!blog?.content) return [];

    const temp = document.createElement("div");
    temp.innerHTML = getProcessedContent(blog.content);

    return Array.from(temp.querySelectorAll("h2, h3")).map((h) => ({
      text: h.innerText,
      id: h.innerText
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
    }));
  }, [blog]);

  // ----------------------------
  // LOADING STATES
  // ----------------------------
  if (loading)
    return <div className="text-white p-20 text-center">Loading...</div>;

  if (!blog)
    return <div className="text-white p-20 text-center">Blog not found.</div>;

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="bg-[#121316] min-h-screen text-white pt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <article className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-neutral-400 border-b border-neutral-800 pb-8 mb-8">
            <img
              src={
                blog.authorImg ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  blog.author || "User",
                )}&background=312e81&color=fff&rounded=true`
              }
              className="w-10 h-10 rounded-full"
              alt="Author"
            />

            <div>
              <p className="text-white font-medium">
                {blog.author?.name || "DevHub User"}
              </p>
              <p>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                • 8 MIN READ
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-sm sm:prose lg:prose-lg max-w-none overflow-hidden break-words">
            {parse(getProcessedContent(blog.content), renderOptions)}
          </div>

          <Comments blogId={id} />
        </article>

        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="space-y-6 hidden lg:block">
          <div className="bg-[#09090B] p-5 border border-neutral-800 rounded-lg sticky top-24">
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">
              Table of Contents
            </h3>

            <ul className="space-y-2.5 text-sm text-neutral-400">
              {headings.map((h, i) => (
                <li
                  key={i}
                  className={`transition cursor-pointer ${
                    activeId === h.id
                      ? "text-indigo-400 underline decoration-2 underline-offset-4"
                      : "hover:text-indigo-400"
                  }`}
                >
                  <a href={`#${h.id}`} onClick={() => setActiveId(h.id)}>
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BlogPage;
