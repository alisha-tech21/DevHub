/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0F172A",
        darkCard: "#1E293B",
        neonAccent: "#38BDF8",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Yeh line zaroori hai
  ],
};
