import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import CommandPalette from "./CommandPalette";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [allBlogs, setAllBlogs] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/blogs")
      .then((res) => res.json())
      .then((data) => setAllBlogs(data.data))
      .catch((err) => console.error(err));
  }, []);

  const getLinkStyle = (path) => {
    return `cursor-pointer transition-all ${
      location.pathname === path
        ? "text-white border-b border-white pb-0.5"
        : "text-neutral-400 hover:text-white"
    }`;
  };

  return (
    <>
      <nav className="bg-[#000000] text-white w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-neutral-900 sticky top-0 z-[100] isolate">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight flex items-center gap-1"
        >
          <span className="bg-gradient-to-r from-purple-500 via-violet-400 via-fuchsia-300 to-emerald-400 bg-clip-text text-transparent font-extrabold">
            Dev
          </span>
          <span className="text-white">Hub</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className={getLinkStyle("/")}>
            Home
          </Link>
          <Link to="/blogs" className={getLinkStyle("/blogs")}>
            Blog
          </Link>
          <Link to="/portfolio" className={getLinkStyle("/portfolio")}>
            My Portfolio
          </Link>
          <Link to="/write" className={getLinkStyle("/write")}>
            Write
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="flex items-center space-x-5 text-gray-500"
          ref={dropdownRef}
        >
          <button
            onClick={() => setPaletteOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            <FaSearch />
          </button>

          <FaBell className="hover:text-white cursor-pointer" />

          {/* 🔥 IF USER NOT LOGGED IN */}
          {!user && (
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigate("/login", {
                    state: {
                      from: "/",
                    },
                  })
                }
                className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() =>
                  navigate("/signup", {
                    state: {
                      from: "/",
                    },
                  })
                }
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* 🔥 IF USER LOGGED IN */}
          {user && (
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  "https://ui-avatars.com/api/?name=" + (user?.name || "User")
                }
                className="w-8 h-8 rounded-full cursor-pointer border border-neutral-700 hover:border-indigo-500 transition-all object-cover"
                onClick={() => setShowDropdown(!showDropdown)}
                alt="Profile"
              />

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-[#0D0D0D] border border-neutral-800 rounded-xl shadow-2xl py-2 z-[9999]">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
                    <img
                      src={
                        user?.avatar ||
                        "https://ui-avatars.com/api/?name=" +
                          (user?.name || "User")
                      }
                      className="w-10 h-10 rounded-full border border-neutral-700 object-cover"
                      alt="User"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">
                        {user?.name || "Dev User"}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {user?.email || "user@devhub.com"}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/portfolio"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    >
                      My Portfolio
                    </Link>

                    <div className="border-t border-neutral-800 my-2"></div>

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
        blogs={allBlogs}
      />
    </>
  );
}

export default Navbar;
