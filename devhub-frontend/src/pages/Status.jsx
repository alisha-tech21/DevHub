import React from "react";
import { useNavigate } from "react-router-dom";

function Status() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-neutral-500 hover:text-indigo-400 mb-8 transition-colors"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">System Status</h1>
      <p className="text-neutral-500 mb-10">
        Real-time monitoring of DevHub infrastructure.
      </p>

      <div className="space-y-4">
        {/* Status Card */}
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">API Services</h3>
            <p className="text-sm text-neutral-400">
              Operational uptime: 99.99%
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-mono">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            OPERATIONAL
          </div>
        </div>

        {/* Incident History Area */}
        <div className="mt-12">
          <h4 className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-4">
            Incident History
          </h4>
          <div className="text-neutral-400 text-sm italic border-l border-neutral-800 pl-4">
            No incidents reported in the last 30 days.
          </div>
        </div>
      </div>
    </div>
  );
}
export default Status;
