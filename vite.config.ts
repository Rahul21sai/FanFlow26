import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];
  if (mode !== 'test' && process.env.NODE_ENV !== 'test') {
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    plugins.push(tailwindcss());
  }
  
  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});
