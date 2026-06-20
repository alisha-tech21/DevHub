import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CTASection() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // CTASection.jsx mein ye update karein:
  const handleGetStarted = () => {
    if (user) {
      navigate("/write");
    } else {
      // Current location pass kar rahe hain taake login ke baad wapas aa saken
      navigate("/login", { state: { from: { pathname: "/" } } });
    }
  };

  return (
    <div className="w-full bg-[#050505] py-20 px-6">
      <div className="w-full max-w-5xl mx-auto bg-[#0A0A0A] border border-neutral-900 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Showcase Your Work?
        </h2>
        <p className="text-neutral-400 mb-8 max-w-lg mx-auto text-sm">
          Join 10,000+ developers who use DevHub to manage their online presence
          and blog without touching a line of CSS.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all"
          >
            Get Started Free
          </button>
          <button
            onClick={() => window.open("/documentation", "_blank")}
            className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 rounded-lg font-semibold transition-all"
          >
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}

export default CTASection;
