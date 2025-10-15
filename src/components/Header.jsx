import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function getUserFromStorage() {
  try {
    const role = localStorage.getItem("user-logged"); // 'admin' | 'usuario' | null
    const data = JSON.parse(localStorage.getItem("user-data") || "{}");
    return role ? { role, data } : null;
  } catch {
    return null;
  }
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isAdmin = location.pathname.startsWith("/admin"); 
  const [user, setUser] = useState(() => getUserFromStorage());

  // Sincroniza si cambia localStorage (p.ej. en otra pestaña)
  useEffect(() => {
    const onStorage = () => setUser(getUserFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("user-logged");
      localStorage.removeItem("user-email");
      localStorage.removeItem("user-data");
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  return (
    <header
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)",
        minHeight: "80px",
      }}
    >
      <div className="container-fluid px-4">
        <h1 className="navbar-brand mb-0 fw-bold" id="h1_titulo">
          {isAdmin ? "Panel Admin · Eventos Chile" : "Inicio · Eventos Chile"}
        </h1>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navegacionPrincipal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <nav
          className="collapse navbar-collapse justify-content-end"
          id="navegacionPrincipal"
        >
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <Link to="/main" className="nav-link px-3 py-2 rounded-pill">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/eventos" className="nav-link px-3 py-2 rounded-pill">
                Eventos
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className="nav-link px-3 py-2 rounded-pill"
                  >
                    Mi Gestión
                  </Link>
                </li>
                {/* descomentar cuando se cree la pagina de perfil:
                <li className="nav-item">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/perfil">Mi Perfil</Link>
                </li>
                */}
                <li className="nav-item">
                  <button
                    className="nav-link px-3 py-2 rounded-pill btn btn-link"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/auth" className="nav-link px-3 py-2 rounded-pill">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

