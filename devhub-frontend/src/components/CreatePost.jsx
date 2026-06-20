import React from "react";
import { FaCode, FaImage, FaLink } from "react-icons/fa";

function CreatePost() {
  return (
    <div className="bg-[#1E293B] rounded-xl p-4 shadow-lg border border-gray-700 w-full max-w-2xl mb-6">
      <div className="flex items-center space-x-3">
        {/* Mock User Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#38BDF8] flex items-center justify-center text-slate-900 font-bold">
          U
        </div>
        {/* Input Trigger */}
        <input
          type="text"
          placeholder="What project are you working on, or what's on your mind?"
          className="bg-[#0F172A] text-gray-200 placeholder-gray-500 text-sm rounded-lg flex-1 px-4 py-3 outline-none border border-transparent focus:border-gray-600 transition-all"
        />
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 text-xs sm:text-sm text-gray-400">
          <button className="flex items-center space-x-2 hover:text-[#38BDF8] transition-colors py-1 px-2 rounded hover:bg-[#0F172A]">
            <FaCode className="text-[#38BDF8]" />
            <span>Repository</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-400 transition-colors py-1 px-2 rounded hover:bg-[#0F172A]">
            <FaImage className="text-green-400" />
            <span>Media</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-yellow-400 transition-colors py-1 px-2 rounded hover:bg-[#0F172A]">
            <FaLink className="text-yellow-400" />
            <span>Live Link</span>
          </button>
        </div>

        <button className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-900 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md">
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
