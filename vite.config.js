import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/tablero/',
  devtools: {
    // Remove this `apply` property to enable devtools for build as well
    apply: 'serve',
  },
})
