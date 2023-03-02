import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import viteEslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteEslintPlugin()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
});
