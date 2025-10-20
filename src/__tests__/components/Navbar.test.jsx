import { fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Navbar from '../../components/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { renderWithAuth } from '../test-utils.jsx';

describe('Navbar Component', () => {
    describe('Renderizado Básico', () => {
        it('debería renderizar el logo/título de la aplicación', () => {
            renderWithAuth(<Navbar />);

            // Buscar el título principal
            const titulo = screen.getByText(/Eventos Chile/i);
            expect(titulo).toBeInTheDocument();
        });

        it('debería renderizar los links de navegación principales', () => {
            renderWithAuth(<Navbar />);

            // Links que siempre deben estar visibles
            expect(screen.getByRole('link', { name: /Inicio/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /^Eventos$/i })).toBeInTheDocument();
        });

        it('debería ser responsive (tener botón de menú hamburguesa)', () => {
            renderWithAuth(<Navbar />);

            // El navbar debe tener el botón de toggle para móviles
            const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
            expect(toggleButton).toBeInTheDocument();
        });
    });

    describe('Navegación como Usuario No Autenticado', () => {
        it('debería mostrar link de "Iniciar sesión" cuando no hay usuario', () => {
            renderWithAuth(<Navbar />);

            const loginLink = screen.getByRole('link', { name: /Iniciar sesión/i });
            expect(loginLink).toBeInTheDocument();
            expect(loginLink).toHaveAttribute('href', '/auth');
        });

        it('NO debería mostrar opciones de admin si no está autenticado', () => {
            renderWithAuth(<Navbar />);

            const adminLink = screen.queryByRole('link', { name: /Admin/i });
            expect(adminLink).not.toBeInTheDocument();
        });

        it('NO debería mostrar link de perfil si no está autenticado', () => {
            renderWithAuth(<Navbar />);

            const perfilLink = screen.queryByRole('link', { name: /Perfil/i });
            expect(perfilLink).not.toBeInTheDocument();
        });

        it('NO debería mostrar botón de cerrar sesión si no está autenticado', () => {
            renderWithAuth(<Navbar />);

            const logoutButton = screen.queryByRole('button', { name: /Cerrar sesión/i });
            expect(logoutButton).not.toBeInTheDocument();
        });
    });

    describe('Navegación como Usuario Autenticado (No Admin)', () => {
        it('debería mostrar email del usuario autenticado', () => {
            // Simular usuario autenticado
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            renderWithAuth(<Navbar />);

            // El email debe estar visible en algún lugar del navbar
            expect(screen.getByText(/usuario@test.com/i)).toBeInTheDocument();
        });

        it('debería mostrar link a "Mi Perfil"', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            renderWithAuth(<Navbar />);

            const perfilLink = screen.getByRole('link', { name: /Perfil/i });
            expect(perfilLink).toBeInTheDocument();
            expect(perfilLink).toHaveAttribute('href', '/perfil');
        });

        it('NO debería mostrar link de administración para usuario normal', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            renderWithAuth(<Navbar />);

            const adminLink = screen.queryByRole('link', { name: /Admin/i });
            expect(adminLink).not.toBeInTheDocument();
        });

        it('debería mostrar botón de "Cerrar sesión"', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            renderWithAuth(<Navbar />);

            const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });
            expect(logoutButton).toBeInTheDocument();
        });

        it('NO debería mostrar link de "Iniciar sesión" si está autenticado', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            renderWithAuth(<Navbar />);

            const loginLink = screen.queryByRole('link', { name: /Iniciar sesión/i });
            expect(loginLink).not.toBeInTheDocument();
        });
    });

    describe('Navegación como Administrador', () => {
        it('debería mostrar email del administrador', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(<Navbar />);

            expect(screen.getByText(/admin@test.com/i)).toBeInTheDocument();
        });

        it('debería mostrar link a "Gestión Admin"', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(<Navbar />);

            const adminLink = screen.getByRole('link', { name: /Admin/i });
            expect(adminLink).toBeInTheDocument();
            expect(adminLink).toHaveAttribute('href', '/admin');
        });

        it('debería mostrar link a "Mi Perfil"', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(<Navbar />);

            const perfilLink = screen.getByRole('link', { name: /Perfil/i });
            expect(perfilLink).toBeInTheDocument();
        });

        it('debería mostrar botón de "Cerrar sesión"', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(<Navbar />);

            const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });
            expect(logoutButton).toBeInTheDocument();
        });
    });

    describe('Funcionalidad de Logout', () => {
        it('debería limpiar localStorage al hacer click en cerrar sesión', () => {
            // Simular usuario autenticado
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            renderWithAuth(<Navbar />);

            const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });

            // Hacer click en logout
            fireEvent.click(logoutButton);

            // Verificar que se limpió el localStorage
            expect(localStorage.getItem('user-logged')).toBeNull();
            expect(localStorage.getItem('user-email')).toBeNull();
        });

        it('debería llamar a la función logout del contexto', () => {
            // Mock de la función logout
            const mockLogout = vi.fn();

            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            // Renderizar con mock de logout
            renderWithAuth(<Navbar />, { logout: mockLogout });

            const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });
            fireEvent.click(logoutButton);

            // Verificar que se llamó a logout
            expect(mockLogout).toHaveBeenCalledTimes(1);
        });
    });

    describe('Links de Navegación', () => {
        it('todos los links principales deben tener href correcto', () => {
            renderWithAuth(<Navbar />);

            const inicioLink = screen.getByRole('link', { name: /Inicio/i });
            const eventosLink = screen.getByRole('link', { name: /^Eventos$/i });

            expect(inicioLink).toHaveAttribute('href', '/');
            expect(eventosLink).toHaveAttribute('href', '/eventos');
        });

        it('el link de inicio debe llevar a la ruta raíz', () => {
            renderWithAuth(<Navbar />);

            const inicioLink = screen.getByRole('link', { name: /Inicio/i });
            expect(inicioLink.getAttribute('href')).toBe('/');
        });
    });

    describe('Estilos y Clases CSS', () => {
        it('debería tener clase navbar de Bootstrap', () => {
            const { container } = renderWithAuth(<Navbar />);

            const navbar = container.querySelector('.navbar');
            expect(navbar).toBeInTheDocument();
        });

        it('debería tener estilos responsivos', () => {
            const { container } = renderWithAuth(<Navbar />);

            // Verificar clases de Bootstrap para responsive
            const navbar = container.querySelector('.navbar-expand-lg');
            expect(navbar).toBeInTheDocument();
        });
    });

    describe('Accesibilidad', () => {
        it('debería tener estructura semántica correcta', () => {
            const { container } = renderWithAuth(<Navbar />);

            // Debe ser un header o nav
            const nav = container.querySelector('header') || container.querySelector('nav');
            expect(nav).toBeInTheDocument();
        });

        it('el botón de toggle debe tener aria-label', () => {
            renderWithAuth(<Navbar />);

            const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
            expect(toggleButton).toHaveAttribute('aria-label');
        });

        it('los links deben ser navegables por teclado', () => {
            renderWithAuth(<Navbar />);

            const inicioLink = screen.getByRole('link', { name: /Inicio/i });

            // Los links deben tener role="link" implícitamente
            expect(inicioLink.tagName).toBe('A');
        });
    });

    describe('Estados Dinámicos', () => {
        it('debería actualizar cuando cambia el estado de autenticación', () => {
            const { rerender } = renderWithAuth(<Navbar />);

            // Inicialmente sin autenticar
            expect(screen.getByRole('link', { name: /Iniciar sesión/i })).toBeInTheDocument();

            // Simular login
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'usuario@test.com');

            // Re-renderizar
            rerender(
                <AuthProvider>
                    <BrowserRouter>
                        <Navbar />
                    </BrowserRouter>
                </AuthProvider>
            );

            // Ahora debe mostrar opciones de usuario autenticado
            expect(screen.queryByRole('link', { name: /Iniciar sesión/i })).not.toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('debería manejar correctamente emails muy largos', () => {
            const emailLargo = 'usuario.con.nombre.muy.largo@dominio.ejemplo.com';
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', emailLargo);

            renderWithAuth(<Navbar />);

            expect(screen.getByText(emailLargo)).toBeInTheDocument();
        });

        it('debería funcionar sin errores si localStorage está vacío', () => {
            localStorage.clear();

            expect(() => {
                renderWithAuth(<Navbar />);
            }).not.toThrow();
        });

        it('debería manejar datos corruptos en localStorage', () => {
            localStorage.setItem('user-logged', 'invalid-role');
            localStorage.setItem('user-email', '');

            expect(() => {
                renderWithAuth(<Navbar />);
            }).not.toThrow();
        });
    });
});
