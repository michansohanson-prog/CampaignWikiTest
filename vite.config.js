import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  /* 
     DEPLOYMENT NOTE: 
     When you eventually deploy to GitHub Pages, uncomment the line below 
     and replace '/repository-name/' with your actual repository name.
  */
  // base: '/my-campaign-wiki/',

  server: {
    port: 5173,
    open: true, // This automatically opens your browser when you run 'npm run dev'
    host: true   // Allows access from other devices on your local network (useful for mobile testing)
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser', // Ensure terser is installed if you want maximum compression
  }
})
