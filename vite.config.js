import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/tablero/',
  plugins: [react()],
  devtools: {
    // Remove this `apply` property to enable devtools for build as well
    apply: 'serve',
  },
})
