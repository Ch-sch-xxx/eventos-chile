import {Link} from "react-router-dom";
function Header() {
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
          Inicio · Eventos Chile
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
              <Link to="/main" className="nav-link px-3 py-2 rounded-pill" >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to ="/eventos" className="nav-link px-3 py-2 rounded-pill">
                Eventos
              </Link>
            </li>
            <li className="nav-item">
              <Link to ="/auth"className="nav-link px-3 py-2 rounded-pill" >
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
