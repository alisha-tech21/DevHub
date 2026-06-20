import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-800 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-bold text-white hover:text-indigo-400 transition-colors"
      >
        {question}
        <span
          className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <p className="text-neutral-400 mt-2 text-sm animate-in fade-in duration-300">
          {answer}
        </p>
      )}
    </div>
  );
};
function Documentation() {
  const navigate = useNavigate();
  const { sectionId = "getting-started" } = useParams();

  const sections = [
    { id: "getting-started", title: "Getting Started" },
    { id: "portfolio", title: "Portfolio Management" },
    { id: "blogging", title: "Blogging Guide" },
    { id: "api", title: "API Reference" },
    { id: "faq", title: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row pt-20 max-w-7xl mx-auto px-6">
      <aside className="w-full md:w-64 mb-10 md:mb-0 md:mr-16 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-neutral-500 hover:text-white flex items-center gap-2 mb-8 text-sm transition-all"
        >
          ← Back
        </button>
        <h3 className="text-xl font-bold mb-6 text-indigo-400">
          Documentation
        </h3>
        <nav className="flex flex-col gap-4">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={`/documentation/${section.id}`}
              className={`text-left text-sm transition-colors ${
                sectionId === section.id
                  ? "text-white font-bold"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {section.title}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 pb-20 space-y-16">
        {sectionId === "getting-started" && (
          <section>
            <h1 className="text-4xl font-bold mb-8">
              Getting Started with DevHub
            </h1>
            <p className="text-neutral-400 leading-relaxed mb-6">
              DevHub serves as an integrated ecosystem tailored specifically for
              software engineers and developers. By bridging the gap between raw
              GitHub data and high-end portfolio presentation, we allow you to
              focus on your code while we handle your professional digital
              identity. Getting started is a streamlined process designed to
              take you from a raw profile to a fully deployed portfolio in under
              60 seconds.
            </p>
            <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 space-y-6">
              <h4 className="font-bold text-xl text-indigo-300">
                Phase 1: Deployment Workflow
              </h4>
              <p className="text-neutral-300">
                1. <strong>Authentication & Sync:</strong> Upon your first
                visit, the system initiates a secure handshake with GitHub to
                retrieve your public activity and repository metadata. This is a
                read-only process, ensuring your account security remains
                uncompromised.
              </p>
              <p className="text-neutral-300">
                2. <strong>Profile Generation:</strong> Once the system locates
                your username, our engine parses your pinned repositories,
                contribution graph, and language proficiency to generate a
                personalized landing page.
              </p>
              <p className="text-neutral-300">
                3. <strong>Customization Access:</strong> After generation, you
                can claim your profile by logging in, which unlocks advanced
                editing features, blog publishing rights, and the ability to
                manually tweak your portfolio’s layout settings.
              </p>
            </div>
          </section>
        )}

        {sectionId === "portfolio" && (
          <section>
            <h1 className="text-4xl font-bold mb-8">Portfolio Management</h1>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Your portfolio serves as a live reflection of your technical
              journey. Unlike static HTML templates, DevHub portfolios are
              reactive and context-aware. They pull data dynamically, meaning
              your accomplishments are updated in real-time as you commit and
              push to your repositories.
            </p>
            <div className="grid gap-8">
              <div className="border-l-2 border-indigo-500 pl-6">
                <h5 className="font-bold text-lg mb-2">
                  Automated Tech Stack Identification
                </h5>
                <p className="text-neutral-400 text-sm">
                  Our heuristic engine scans your repository files to calculate
                  your primary language usage. This generates a clean, visually
                  appealing "Tech Stack" section on your profile, highlighting
                  your proficiency in languages like TypeScript, Go, or Rust
                  without requiring manual entry.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-6">
                <h5 className="font-bold text-lg mb-2">Data Refresh Cycles</h5>
                <p className="text-neutral-400 text-sm">
                  To ensure performance, data is cached at the edge. Portfolios
                  undergo a deep-sync process every 24 hours. For urgent
                  updates—such as pinning a new repository—you can trigger a
                  manual sync via the "Refresh Profile" button located in your
                  dashboard.
                </p>
              </div>
            </div>
          </section>
        )}

        {sectionId === "blogging" && (
          <section>
            <h1 className="text-4xl font-bold mb-8">
              Professional Blogging Guide
            </h1>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Writing technical content is the most effective way to establish
              thought leadership. DevHub’s blogging environment is built to
              remove friction, supporting Markdown so you can draft articles as
              comfortably as you write code.
            </p>
            <div className="space-y-6">
              <div className="bg-neutral-900 p-6 rounded-lg">
                <h5 className="font-bold text-white mb-2">
                  Advanced Editor Features
                </h5>
                <p className="text-neutral-400">
                  Our editor supports syntax highlighting for over 50 languages,
                  LaTeX support for mathematical formulas, and responsive media
                  embedding. Whether you are explaining complex algorithms or
                  sharing a new framework setup, the editor ensures your content
                  is readable across all devices.
                </p>
              </div>
              <div className="bg-neutral-900 p-6 rounded-lg">
                <h5 className="font-bold text-white mb-2">SEO & Discovery</h5>
                <p className="text-neutral-400">
                  Every blog post is automatically rendered with SEO-optimized
                  metadata. By tagging your posts with relevant topics (e.g.,
                  #DevOps, #SystemDesign), you increase the likelihood of your
                  content appearing in the Trending section, exposing your work
                  to thousands of developers globally.
                </p>
              </div>
            </div>
          </section>
        )}

        {sectionId === "api" && (
          <section>
            <h1 className="text-4xl font-bold mb-8">API Reference</h1>
            <p className="text-neutral-400 mb-8">
              We believe in an open web. Developers can tap into DevHub’s
              infrastructure to build custom dashboards, data visualizations, or
              integrate our blog feeds directly into their personal websites.
            </p>
            <div className="bg-neutral-900 p-6 rounded border border-neutral-800 font-mono text-indigo-400 space-y-4">
              <p>
                <code>GET /api/blogs</code> <br />
                <span className="text-neutral-500">
                  // Returns a paginated list of all globally published blogs.
                </span>
              </p>
              <p>
                <code>GET /api/blogs/:id</code> <br />
                <span className="text-neutral-500">
                  // Fetches full content and metadata for a specific post.
                </span>
              </p>
              <p>
                <code>GET /api/github/profile/:username</code> <br />
                <span className="text-neutral-500">
                  // Returns structured profile data: bio, repos, and stack
                  stats.
                </span>
              </p>
            </div>
            <p className="text-neutral-500 mt-6 italic text-sm">
              Note: All requests are rate-limited to 60 requests per minute to
              ensure service stability.
            </p>
          </section>
        )}

        {sectionId === "faq" && (
          <section>
            <h1 className="text-4xl font-bold mb-8">
              Frequently Asked Questions
            </h1>
            <div className="space-y-4">
              <FAQItem
                question="How does DevHub handle my private repositories?"
                answer="DevHub has zero access to your private data. Our integration utilizes GitHub’s public API scope, meaning we cannot view, read, or track any code or metadata residing within your private repositories."
              />
              <FAQItem
                question="Can I host my DevHub blog on my own domain?"
                answer="Currently, all blogs are hosted under our sub-domain architecture. We are currently testing custom domain integration for Pro users and expect to roll this out by Q4 2026."
              />
              <FAQItem
                question="What happens if I change my GitHub username?"
                answer="Changing your GitHub handle will disconnect your current DevHub profile. You will need to log in again with your new username. The system will then treat it as a new sync, but you can contact support to merge your historical blog posts."
              />
              <FAQItem
                question="Does the platform support collaboration or team blogs?"
                answer="At present, DevHub is focused on individual developer branding. Collaborative blogging tools are on our product roadmap for the next development phase."
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Documentation;
