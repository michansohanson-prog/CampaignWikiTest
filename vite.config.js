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
     IMPORTANT: This is the final step for your GitHub Pages deployment.
     It tells Vite that all assets are inside the /CampaignWikiTest/ subfolder.
  */
  base: '/CampaignWikiTest/', 

  server: {
    port: 5173,
    open: true, // This automatically opens your browser when you run 'npm run dev'
    host: true   // Allows access from other devices on your local network (useful for mobile testing)
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser', 
  }
})
