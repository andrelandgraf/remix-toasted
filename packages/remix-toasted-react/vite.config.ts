/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    reporters: 'verbose',
    setupFiles: './tests/setup.ts',
    environment: 'jsdom',
  },
});
