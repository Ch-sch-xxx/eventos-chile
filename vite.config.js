// vite.config.js
// Configuración básica de Vite para React + GitHub Pages
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    // Plugin de React para habilitar Fast Refresh
    plugins: [react()],

    // Importante: debe coincidir con el nombre del repo en GitHub
    // En mi caso: github.com/usuario/eventos-chile → base: '/eventos-chile/'
    base: '/eventos-chile/',

    // Carpeta donde se genera el build para desplegar
    build: {
        outDir: 'dist'
    }
})
