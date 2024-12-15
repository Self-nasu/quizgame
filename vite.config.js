import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/quizgame/', // Add the repository name here
  plugins: [react()],
});
