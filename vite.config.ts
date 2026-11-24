import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.NVIDIA_NEMOTRON': JSON.stringify(env.NVIDIA_NEMOTRON || ''),
      'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY || env.NVIDIA_NEMOTRON || ''),
      'process.env.NEMOTRON_MODEL': JSON.stringify(env.NEMOTRON_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free'),
      'process.env': JSON.stringify({}),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
