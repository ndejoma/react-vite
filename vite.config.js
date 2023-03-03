import { defineConfig } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';
import path from 'node:path';
import eslint from 'vite-plugin-eslint';
import removeConsole from 'vite-plugin-remove-console';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactSwc(), eslint(), removeConsole()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
});
