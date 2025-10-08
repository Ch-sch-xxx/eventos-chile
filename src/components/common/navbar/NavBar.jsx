// src/components/common/NavBar.jsx
import React from "react";
import "./NavBar.css"; // importamos los estilos específicos

function NavBar() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid px-4">
        <h1 className="navbar-brand mb-0 fw-bold" id="h1_titulo">Inicio · Eventos Chile</h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navegacionPrincipal"
          aria-controls="navegacionPrincipal"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <nav className="collapse navbar-collapse justify-content-end" id="navegacionPrincipal">
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <a className="nav-link px-3 py-2 rounded-pill" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 py-2 rounded-pill" href="/eventos">Eventos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 py-2 rounded-pill" href="/auth">Iniciar sesión</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
