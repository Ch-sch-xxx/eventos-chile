// src/App.jsx
// Configuración de rutas principales con React Router

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta principal - Home */}
                <Route path="/" element={<Home />} />

                {/* Rutas futuras (descomentar cuando estén listas) */}
                {/* <Route path="/eventos" element={<Eventos />} /> */}
                {/* <Route path="/auth" element={<Auth />} /> */}
                {/* <Route path="/admin" element={<Admin />} /> */}
                {/* <Route path="/perfil" element={<Perfil />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
