// Pie de página con información de contacto

import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer
            className="mt-5 py-4 text-white"
            style={{
                background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)'}}>

            <div className="container text-center">
                {/* Email de contacto - IDs preservados para estilos CSS */}
                <p className="mb-2" id="contacto">
                    Contacto:{' '}
                    <a
                        id="mail"
                        href="mailto:eventoschile@gmail.com"
                        className="text-info text-decoration-none"
                    >
                        eventoschile@gmail.com
                    </a>


                </p>

                {/* Link a sección "Acerca de Nosotros" */}
                <p className="mb-0">
                    <Link
                        id="Ftnosotros"
                        to="/#nosotros"
                        className="text-info text-decoration-none"
                    >
                        Acerca de Nosotros
                    </Link>

                </p>
            </div>
        </footer>
    );
}

export default Footer;
