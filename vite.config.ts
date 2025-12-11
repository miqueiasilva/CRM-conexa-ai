import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true, // Garante que se a porta 3000 estiver ocupada, o servidor avisa em vez de mudar
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})