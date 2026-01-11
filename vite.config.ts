import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain: draw-that-flag.lessismore.studio
  server: {
    port: 5178,
  },
})
