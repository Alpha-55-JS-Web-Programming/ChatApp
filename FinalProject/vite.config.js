import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import postcssConfig from './postcss.config.js'; // Import the PostCSS config

export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcssOptions: postcssConfig,
  },
});
