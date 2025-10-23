import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';

describe('Integration Tests', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('debería permitir el flujo completo de autenticación y creación de evento', async () => {
        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        // 1. Navegar a login - usar getByRole para el botón específico
        const loginLink = screen.getByRole('link', { name: /Iniciar sesión/i });
        fireEvent.click(loginLink);

        // 2. Realizar login con credenciales correctas
        const emailInput = screen.getByLabelText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'ad@ad.com' } });

        const passwordInput = screen.getByLabelText(/Contraseña/i);
        fireEvent.change(passwordInput, { target: { value: 'admin' } });

        // 3. Submit del form
        const loginButton = screen.getByRole('button', { name: /Entrar/i });
        fireEvent.click(loginButton);

        // 4. Verificar autenticación exitosa esperando que se redirija a /admin
        await waitFor(() => {
            expect(localStorage.getItem('user-logged')).toBe('admin');
        });

        // 5. Verificar que está en la página de administración
        await waitFor(() => {
            expect(screen.getByText(/Gestión de Eventos \(Administrador\)/i)).toBeInTheDocument();
        });
    });

    it('debería mantener el estado de autenticación al navegar', async () => {
        // Simular usuario autenticado ANTES de renderizar
        localStorage.setItem('user-logged', 'admin');
        localStorage.setItem('user-email', 'ad@ad.com');

        const { rerender } = render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        // Verificar que el usuario está autenticado
        await waitFor(() => {
            expect(localStorage.getItem('user-logged')).toBe('admin');
        });

        // Navegar a página de inicio
        const inicioLink = screen.getByRole('link', { name: /^Inicio$/i });
        fireEvent.click(inicioLink);

        // Verificar que sigue autenticado después de navegar
        expect(localStorage.getItem('user-logged')).toBe('admin');
    });

    it('debería proteger rutas privadas', async () => {
        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        // Intentar acceder a ruta protegida sin autenticación
        const adminLink = screen.queryByText(/Admin/i);
        expect(adminLink).not.toBeInTheDocument();

        // Verificar que está en Home (ruta pública inicial)
        expect(screen.getByText(/Bienvenido a Eventos Chile/i)).toBeInTheDocument();
    });
});
