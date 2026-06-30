import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaPalette, FaChevronDown } from "react-icons/fa";

function ThemeSwitcher() {
  const { themeName, setThemeName, theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { id: "dark", name: "🌑 Dark" },
    { id: "ocean", name: "🌊 Ocean" },
    { id: "emerald", name: "💚 Emerald" },
    { id: "neon", name: "💜 Neon" },
    { id: "light", name: "🤍 Light" },
  ];

  useEffect(() => {
    const close = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 h-11 rounded-lg transition-all duration-300 hover:scale-105"
        style={{
          background: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.border}`,
        }}
      >
        <FaPalette style={{ color: theme.accent }} />

        <span className="font-medium">
          {themes.find((t) => t.id === themeName)?.name}
        </span>

        <FaChevronDown
          className={`transition ${open ? "rotate-180" : ""}`}
          style={{ color: theme.muted }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setThemeName(item.id);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left transition-all duration-200"
              style={{
                background: themeName === item.id ? theme.hover : "transparent",

                color: themeName === item.id ? theme.accent : theme.text,

                fontWeight: themeName === item.id ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  themeName === item.id ? theme.hover : "transparent";
              }}
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
