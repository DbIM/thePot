import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // 👈 позволяет подключение с другого устройства
    port: 5173
  }
});
