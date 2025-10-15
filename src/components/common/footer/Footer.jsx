import React from "react";

function Footer() {
  return (
    <footer
      className="mt-5 py-4 text-white"
      style={{
        background: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)",
      }}
    >
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
  );
}

export default Footer;
