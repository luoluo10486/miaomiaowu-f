import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          three: ["three"]
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api/ragent": {
        target: "http://localhost:9090",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/ragent/, "")
      },
      "/api": {
        target: "http://localhost:9090",
        changeOrigin: true,
        secure: false
      },
      "/luoluo": {
        target: "http://localhost:9090",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
