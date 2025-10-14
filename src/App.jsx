// ...existing code...
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Main from "./Paginas/Main";
import Eventos from "./Paginas/Eventos";
import Auth from "./Paginas/Auth"; 
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Admin from "./Paginas/GestionAdmin"; 

function AppContent() {
  const location = useLocation();
  // Ocultar header/footer en rutas privadas s
  const hideShell = location.pathname.startsWith("/admin") || location.pathname.startsWith("/admin");

  return (
    <>
      {!hideShell && <Header />}
      <Routes>
        <Route path="main" element={<Main />} /> {/* Página principal */}
        <Route path="eventos" element={<Eventos />} /> {/* Página de eventos */}
        <Route path="auth" element={<Auth />} /> {/* Página de autenticación */}
        <Route path="admin" element={<Admin />} /> {/* Página admin añadida */}
      </Routes>
      {!hideShell && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
// ...existing code...