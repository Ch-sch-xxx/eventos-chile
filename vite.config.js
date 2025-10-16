import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configuración de Vitest
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Simula navegador
    globals: true,         // Permite usar describe/it/expect sin importar
    setupFiles: './src/setupTests.js' // Archivo de configuración adicional
  }
})