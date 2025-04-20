import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Ensure react and react-dom are not marked as external
    },
    esbuild: {
      jsx: 'react-jsx', // Correct JSX handling
    },
  },
});
