// src/main.jsx
// Punto de entrada principal: aquí arranca la aplicación React

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Cargo Bootstrap para usar sus estilos y componentes
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Mis estilos personalizados globales
import './index.css'

// Proveedor de autenticación para compartir sesión en toda la app
import { AuthProvider } from './context/AuthContext'

// Componente principal de la aplicación
import App from './App.jsx'

// Renderizo la app envuelta en StrictMode (detecta problemas en desarrollo)
// y en AuthProvider (comparte datos de sesión en todos los componentes)
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
)
