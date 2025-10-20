// Configuración de rutas principales con React Router

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './context/ProtectedRoute';
import Admin from "./pages/Admin.jsx";
import Auth from "./pages/Auth.jsx";
import Eventos from './pages/Eventos';
import Home from './pages/Home';
import Perfil from "./pages/Perfil.jsx";

function App() {
    return (
        // basename para GitHub Pages
        <BrowserRouter basename="/eventos-chile">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
                <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}


export default App;
