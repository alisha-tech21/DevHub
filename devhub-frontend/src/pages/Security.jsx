import React from "react";
import { useNavigate } from "react-router-dom";

function Security() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-neutral-500 hover:text-indigo-400 mb-8 transition-colors"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">Security & Trust</h1>
      <p className="text-neutral-500 mb-12">
        DevHub is built on a foundation of transparency and data privacy.
      </p>

      <div className="grid gap-8">
        {[
          {
            title: "OAuth Standard",
            desc: "We utilize industry-standard OAuth 2.0. DevHub never accesses, stores, or requests your GitHub password or personal credentials.",
          },
          {
            title: "Limited Scope",
            desc: "Our access is restricted to read-only public profile data. We cannot modify, delete, or write to your repositories.",
          },
          {
            title: "Zero Private Access",
            desc: "Privacy is a default, not a feature. Our system is architected to ignore all private repositories.",
          },
          {
            title: "Vulnerability Disclosure",
            desc: "Security researchers are encouraged to report findings to security@devhub.com for a coordinated disclosure process.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group hover:border-indigo-500/30 transition-all border-l border-neutral-800 pl-6"
          >
            <h3 className="font-bold text-white mb-2">{item.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Security;
