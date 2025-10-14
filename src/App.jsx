import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Main from "./Paginas/Main";
import Eventos from "./Paginas/Eventos";
import Auth from "./Paginas/Auth"; 
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="main" element={<Main />} /> {/* Página principal */}
        <Route path="eventos" element={<Eventos />} /> {/* Página de eventos */}
        <Route path="auth" element={<Auth />} /> {/* Página de autenticación */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
