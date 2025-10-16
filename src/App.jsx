// src/App.jsx
// Configuración de rutas principales con React Router

// Usamos HashRouter en lugar de BrowserRouter para compatibilidad con GitHub Pages,
// ya que GitHub Pages no soporta rutas basadas en el historial del navegador.
// HashRouter utiliza rutas basadas en el hash (#), lo que puede afectar el SEO y la apariencia de la URL.
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import Auth from "./pages/Auth.jsx";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from './context/ProtectedRoute';
import Perfil from "./pages/Perfil.jsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta principal - Home */}
                <Route index element={<Home />} />
                <Route path="" element={<Home />} />

                {/* Rutas secundarias */}
                <Route path="eventos" element={<Eventos />} />
                <Route path="auth" element={<Auth />} />
                <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
                <Route path="perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
}

export default App;
