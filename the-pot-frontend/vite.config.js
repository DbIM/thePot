import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- важно: позволяет подключаться с других устройств
    port: 5173, // можешь оставить или изменить
    proxy: {
      "/api": {
        target: "http://localhost:8080", // адрес твоего Spring Boot бэкенда
        changeOrigin: true,
        secure: false,
      },
    },
  },
});