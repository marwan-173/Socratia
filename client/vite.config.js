import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 3000,
    open: true,

    // 🔥 VERY IMPORTANT: Proxy API requests to backend
    proxy: {
      "/api": {
        target: "http://localhost:5000", // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },

  envPrefix: "VITE_",
});
