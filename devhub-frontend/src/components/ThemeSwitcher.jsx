import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaPalette, FaChevronDown } from "react-icons/fa";

function ThemeSwitcher() {
  const { themeName, setThemeName } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const themes = [
    { id: "dark", name: "🌑 Dark" },
    { id: "ocean", name: "🌊 Ocean" },
    { id: "emerald", name: "💚 Emerald" },
    { id: "neon", name: "💜 Neon" },
    { id: "light", name: "🤍 Light" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
        flex
        items-center
        gap-2
        border
        border-neutral-700
        bg-[#05070B]
        px-4
        py-2
        hover:border-cyan-500
        transition
        "
      >
        <FaPalette className="text-cyan-400" />
        <span>{themes.find((t) => t.id === themeName)?.name}</span>
        <FaChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="
          absolute
          right-0
          mt-2
          w-48
          border
          border-neutral-700
          bg-[#05070B]
          shadow-xl
          z-50
          "
        >
          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setThemeName(item.id);
                setOpen(false);
              }}
              className={`
              w-full
              text-left
              px-4
              py-3
              hover:bg-neutral-800
              transition
              ${themeName === item.id ? "text-cyan-400 font-semibold" : ""}
              `}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
