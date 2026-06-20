import React, { useState } from "react";
import { FaImage, FaChevronDown } from "react-icons/fa";

export const ImageUploadButton = ({ editor }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const addImage = async (file) => {
    if (!editor) {
      console.error("Editor instance not found!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.imageUrl) {
        editor.chain().focus().setImage({ src: data.imageUrl }).run();
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Check backend.");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded text-sm hover:bg-neutral-700"
      >
        <FaImage /> Insert Image <FaChevronDown size={10} />
      </button>

      {showDropdown && (
        <div className="absolute top-10 left-0 bg-[#1a1a1a] border border-neutral-700 rounded-lg p-2 w-48 shadow-xl z-50">
          <label className="block p-2 hover:bg-neutral-800 cursor-pointer text-sm">
            Upload from Local File
            <input
              type="file"
              className="hidden"
              onChange={(e) => addImage(e.target.files[0])}
            />
          </label>
        </div>
      )}
    </div>
  );
};
