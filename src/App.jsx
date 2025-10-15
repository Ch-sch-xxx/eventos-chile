import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Main from "./Paginas/Main";
import Eventos from "./Paginas/Eventos";
import Auth from "./Paginas/Auth"; 
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Admin from "./Paginas/GestionAdmin"; 
import "./css/MainStyle.css";
import "./css/EventosStyle.css";
import "./css/StyleAuth.css";
import "./css/AdminStyle.css";
import ProteccionPaginas from "./components/ProteccionPaginas";


function AppContent() {
  const location = useLocation();
  // Ocultar header/footer en rutas privadas 
  const hideShell = location.pathname.startsWith("/admin") 
  return (
    <>
      {!hideShell && <Header />}
      <Routes>
        <Route path="/" element={<Main />} /> {/*Mostrar pagina incial*/}
        <Route path="main" element={<Main />} /> {/* Página principal */}
        <Route path="eventos" element={<Eventos />} /> {/* Página de eventos */}
        <Route path="auth" element={<Auth />} /> {/* Página de autenticación */}
        <Route element={<ProteccionPaginas />}> {/* Rutas protegidas */}
          <Route path="admin" element={<Admin />} /> {/* Página de administración */}
        </Route>
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
