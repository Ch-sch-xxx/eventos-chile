import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from '../../components/Footer';

// Helper para renderizar con Router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Footer Component', () => {
    describe('Renderizado Básico', () => {
        it('debería renderizar el footer correctamente', () => {
            renderWithRouter(<Footer />);

            const footer = screen.getByRole('contentinfo');
            expect(footer).toBeInTheDocument();
        });

        it('debería mostrar el texto de contacto', () => {
            renderWithRouter(<Footer />);

            expect(screen.getByText(/Contacto:/i)).toBeInTheDocument();
        });

        it('debería mostrar el email de contacto', () => {
            renderWithRouter(<Footer />);

            const emailLink = screen.getByRole('link', { name: /eventoschile@gmail.com/i });
            expect(emailLink).toBeInTheDocument();
            expect(emailLink).toHaveAttribute('href', 'mailto:eventoschile@gmail.com');
        });
    });

    describe('Links de Navegación', () => {
        it('debería mostrar el link "Acerca de Nosotros"', () => {
            renderWithRouter(<Footer />);

            const aboutLink = screen.getByRole('link', { name: /Acerca de Nosotros/i });
            expect(aboutLink).toBeInTheDocument();
        });

        it('el link "Acerca de Nosotros" debería apuntar a /#nosotros', () => {
            renderWithRouter(<Footer />);

            const aboutLink = screen.getByRole('link', { name: /Acerca de Nosotros/i });
            expect(aboutLink).toHaveAttribute('href', '/#nosotros');
        });
    });

    describe('Estilos y Clases CSS', () => {
        it('debería tener estilos de fondo con gradiente', () => {
            renderWithRouter(<Footer />);

            const footer = screen.getByRole('contentinfo');
            expect(footer).toHaveStyle({
                background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)'
            });
        });

        it('debería tener clases de padding y margin', () => {
            renderWithRouter(<Footer />);

            const footer = screen.getByRole('contentinfo');
            expect(footer).toHaveClass('mt-5', 'py-4', 'text-white');
        });

        it('el email debería tener clase text-info', () => {
            renderWithRouter(<Footer />);

            const emailLink = screen.getByRole('link', { name: /eventoschile@gmail.com/i });
            expect(emailLink).toHaveClass('text-info', 'text-decoration-none');
        });
    });

    describe('Estructura HTML', () => {
        it('debería tener un contenedor principal', () => {
            renderWithRouter(<Footer />);

            const container = screen.getByRole('contentinfo').querySelector('.container');
            expect(container).toBeInTheDocument();
        });

        it('debería tener contenido centrado', () => {
            renderWithRouter(<Footer />);

            const container = screen.getByRole('contentinfo').querySelector('.container');
            expect(container).toHaveClass('text-center');
        });
    });

    describe('IDs para CSS/JS', () => {
        it('debería tener ID "contacto" en el párrafo de contacto', () => {
            renderWithRouter(<Footer />);

            const contactoParagraph = document.getElementById('contacto');
            expect(contactoParagraph).toBeInTheDocument();
        });

        it('debería tener ID "mail" en el link del email', () => {
            renderWithRouter(<Footer />);

            const mailLink = document.getElementById('mail');
            expect(mailLink).toBeInTheDocument();
            expect(mailLink.tagName).toBe('A');
        });

        it('debería tener ID "Ftnosotros" en el link de nosotros', () => {
            renderWithRouter(<Footer />);

            const nosotrosLink = document.getElementById('Ftnosotros');
            expect(nosotrosLink).toBeInTheDocument();
            expect(nosotrosLink.tagName).toBe('A');
        });
    });

    describe('Accesibilidad', () => {
        it('debería usar la etiqueta semántica <footer>', () => {
            renderWithRouter(<Footer />);

            const footer = screen.getByRole('contentinfo');
            expect(footer.tagName).toBe('FOOTER');
        });

        it('los links deberían ser navegables por teclado', () => {
            renderWithRouter(<Footer />);

            const emailLink = screen.getByRole('link', { name: /eventoschile@gmail.com/i });
            const aboutLink = screen.getByRole('link', { name: /Acerca de Nosotros/i });

            expect(emailLink).toBeVisible();
            expect(aboutLink).toBeVisible();
        });
    });
});
