// vite.config.js
// Configuración básica de Vite para React + GitHub Pages
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    base: '/eventos-chile/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        css: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    }
})
