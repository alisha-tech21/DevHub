import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5176, // <-- Ab yeh hamesha 5176 par hi chalega
    strictPort: true, // <-- Agar 5176 busy hui to error dega, 5173 par auto-shift nahi hoga
  },
});
