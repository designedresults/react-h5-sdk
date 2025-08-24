import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    '__APP_NAME__': JSON.stringify(process.env.npm_package_name),
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    '__APP_DESCRIPTION__': JSON.stringify(process.env.npm_package_description),
    '__BUILD_DATE__': JSON.stringify(new Date().toISOString())
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
  },
  server: {
    proxy: {
      '/m3api-rest': 'http://localhost:3001',
    },
  },
});
