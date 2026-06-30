import { createContext, useState, useEffect } from "react";
import { themes } from "../themes/themes";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(
    localStorage.getItem("theme") || "default",
  );

  useEffect(() => {
    localStorage.setItem("theme", themeName);
  }, [themeName]);

  const value = {
    theme: themes[themeName],
    themeName,
    setThemeName,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
