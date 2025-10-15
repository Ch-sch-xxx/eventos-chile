import React from "react";
import NavBar from "../../components/common/navbar/NavBar";
import "./Style_Inicio.css";

function Inicio() {
  return (
    <>
      {/* Navbar importado */}
      <NavBar />

      {/* Contenido principal */}
      <main className="container my-5">
        {/* Sección Destacado */}
        <section className="row justify-content-center mb-5">
          <div className="col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg" id="destacado">
              <div className="card-body p-5 text-center">
                <h2 className="card-title display-5 fw-bold mb-4 text-dark">
                  Bienvenido a Eventos Chile
                </h2>
                <p className="card-text lead mb-4 text-secondary">
                  Descubre, crea y gestiona tus eventos{" "}
                  <span className="destacado-opcion">.</span>
                </p>
                <a
                  href="/eventos"
                  className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-sm"
                >
                  Ver eventos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Nosotros */}
        <section className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="card border-0 shadow" id="nosotros">
              <div className="card-body p-4">
                <h2 className="card-title h3 mb-3 text-dark">¿Quiénes somos?</h2>
                <p className="card-text text-secondary lh-lg">
                  Plataforma chilena dedicada a facilitar la organización y
                  confirmación de asistencia a todo tipo de eventos. Con nosotros
                  puedes crear eventos presenciales, en streaming o generar acceso
                  por QR.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-5 py-4 text-white">
        <div className="container text-center">
          <p className="mb-2" id="contacto">
            Contacto:{" "}
            <a
              id="mail"
              href="mailto:eventoschile@gmail.com"
              className="text-info text-decoration-none"
            >
              eventoschile@gmail.com
            </a>
          </p>
          <p className="mb-0">
            <a
              id="Ftnosotros"
              href="#nosotros"
              className="text-info text-decoration-none"
            >
              Acerca de Nosotros
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Inicio;
