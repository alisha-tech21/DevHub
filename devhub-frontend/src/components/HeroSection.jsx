import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function HeroSection({ onGenerate, loading }) {
  const [username, setUsername] = useState("");

  // scroll tracking
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const handleSubmit = () => {
    if (username.trim()) {
      onGenerate(username.trim());
    }
  };

  return (
    <motion.section
      style={{
        opacity, // ✅ scroll fade working
        background:
          "radial-gradient(circle at center, rgba(30, 48, 110, 0.38) 0%, rgba(15, 23, 42, 0.1) 50%, rgba(0, 0, 0, 1) 80%)",
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="w-full flex flex-col items-center text-center py-28 px-6"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="bg-neutral-900/80 border border-neutral-800/60 rounded-full px-4 py-1 text-xs text-green-400 font-mono mb-6 backdrop-blur-sm"
      >
        <span className="font-bold">NEW FEATURE</span> • Auto-Layout v2.0 is
        live
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight text-white"
      >
        Your Portfolio, <br />
        <span className="bg-gradient-to-r from-[#93C5FD] via-[#A5B4FC] via-[#34D399] to-[#059669] bg-clip-text text-transparent">
          Instant and Professional.
        </span>
      </motion.h1>

      {/* Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
        className="text-gray-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed"
      >
        Connect your GitHub, pick a template, and deploy a high-performance
        portfolio in seconds. Built for the modern developer ecosystem.
      </motion.p>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-lg bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/50 shadow-2xl mb-8 backdrop-blur-md"
      >
        <div className="flex items-center px-3 text-gray-500 font-mono text-sm w-full flex-1">
          github.com/
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="bg-transparent text-white outline-none w-full ml-1 placeholder-gray-700"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-all w-full sm:w-auto cursor-pointer disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Portfolio"}
        </button>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
