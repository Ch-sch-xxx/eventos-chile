// src/App.jsx
// Configuración de rutas principales con React Router

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import Auth from "./pages/Auth.jsx";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from './context/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta principal - Home */}
                <Route path="/" element={<Home />} />

                {/* Ruta de eventos - ACTIVADA */}
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
                {/*<Route path="/perfil" element={<Perfil />} />*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
