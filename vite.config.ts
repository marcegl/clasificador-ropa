import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio se publica como GitHub Project Page en /clasificador-ropa/.
// Para desarrollo local Vite usa "/" automáticamente.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/clasificador-ropa/' : '/',
}))
