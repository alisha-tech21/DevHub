import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx"; // 1. AuthProvider import karein
import devLogo from "./assets/devlogo.png";

const link = document.querySelector("link[rel~='icon']");
if (link) {
  link.href = devLogo;
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-right" /> {/* Yahan add karein */}
      <App />
    </AuthProvider>
  </StrictMode>,
);
