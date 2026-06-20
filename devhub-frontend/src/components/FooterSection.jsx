import React from "react";
import { Link } from "react-router-dom";

function FooterSection() {
  return (
    <footer className="bg-black w-full py-8 px-8 border-t border-neutral-900">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-mono text-gray-500 tracking-widest">
        <div className="mb-4 sm:mb-0">
          <span className="font-bold text-gray-400">DevHub</span>
          <span className="ml-4 text-gray-600">© 2026 DEVHUB.</span>
        </div>
        <div className="flex space-x-6 uppercase">
          <Link to="/documentation" className="hover:text-gray-300">
            Docs
          </Link>
          <Link to="/documentation/api" className="hover:text-gray-300">
            API
          </Link>
          <Link to="/status" className="hover:text-gray-300">
            Status
          </Link>
          <Link to="/security" className="hover:text-gray-300">
            Security
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
