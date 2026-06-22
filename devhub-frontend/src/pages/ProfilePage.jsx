import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [savedGithubUser, setSavedGithubUser] = useState(null); // New state for persistence
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    techStack: user?.techStack?.join(", ") || "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        techStack: user.techStack?.join(", ") || "",
      });
    }
  }, [user]);
  // 1. Fetch saved portfolio on component mount
  useEffect(() => {
    const fetchSavedPortfolio = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`${API_URL}/api/portfolio/${user._id}`);
        const data = await res.json();
        if (data && data.githubUsername) {
          setSavedGithubUser(data.githubUsername);
        }
      } catch (err) {
        console.error("Error fetching saved portfolio:", err);
      }
    };
    fetchSavedPortfolio();
  }, [user?._id]);

  // Helper to get Headers
  const getAuthHeaders = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${savedUser?.token}`,
    };
  };

  // Save User Details
  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      };
      const res = await fetch(`${API_URL}/api/user/update/${user._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),

        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      const updatedUser = {
        ...data.user,
        token: JSON.parse(localStorage.getItem("user")).token,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  // Avatar Upload Logic
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const uploadRes = await fetch("${API_URL}/api/upload", {
        method: "POST",
        body: formDataObj,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.imageUrl) {
        const updateRes = await fetch(
          `${API_URL}/api/user/update/${user._id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              name: user.name,
              bio: user.bio,
              techStack: user.techStack,
              avatar: uploadData.imageUrl,
            }),
          },
        );
        const updatedData = await updateRes.json();
        const updatedUser = {
          ...updatedData.user,
          token: JSON.parse(localStorage.getItem("user")).token,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16">
      <div className="max-w-5xl mx-auto bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative group cursor-pointer">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.name}`
                }
                className="w-40 h-40 rounded-full border-4 border-neutral-800 shadow-xl transition-transform group-hover:scale-105"
                alt="Avatar"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest cursor-pointer">
                Change
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <h2 className="text-2xl font-semibold mt-6">{user?.name}</h2>
            <p className="text-neutral-500 text-sm">{user?.email}</p>
            {/* Display Saved GitHub Username if exists */}
            {savedGithubUser && (
              <div className="mt-4 px-3 py-1 bg-indigo-900/30 border border-indigo-700 text-indigo-300 text-xs rounded-full">
                GitHub: {savedGithubUser}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-grow">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs text-neutral-500 block mb-2 font-medium">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    className="w-full bg-[#121212] p-3 rounded-xl border border-neutral-700 focus:border-indigo-500 outline-none transition"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  <p className="p-3 bg-[#0f0f0f] rounded-xl border border-neutral-800 text-neutral-300">
                    {user?.name}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-2 font-medium">
                  Email Address
                </label>
                <p className="p-3 bg-[#0f0f0f] rounded-xl border border-neutral-800 text-neutral-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs text-neutral-500 block mb-2 font-medium">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  className="w-full bg-[#121212] p-3 rounded-xl border border-neutral-700 focus:border-indigo-500 outline-none transition"
                  rows="4"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              ) : (
                <p className="p-3 bg-[#0f0f0f] rounded-xl border border-neutral-800 text-neutral-300 min-h-[100px]">
                  {user?.bio || "No bio added."}
                </p>
              )}
            </div>
            <div className="mt-6">
              <label className="text-xs text-neutral-500 block mb-2 font-medium">
                Tech Stack
              </label>

              {isEditing ? (
                <input
                  className="w-full bg-[#121212] p-3 rounded-xl border border-neutral-700 focus:border-indigo-500 outline-none"
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      techStack: e.target.value,
                    })
                  }
                  placeholder="React, Node.js, MongoDB"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.techStack?.length > 0 ? (
                    user.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-900/30 border border-indigo-700 rounded-full text-indigo-300 text-sm"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-neutral-500">No tech stack added.</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 text-neutral-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Edit Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
