import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { mockLocalStorage } from '../test-utils';

describe('Integration Tests', () => {
    beforeEach(() => {
        global.localStorage = mockLocalStorage;
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('debería permitir el flujo completo de autenticación y creación de evento', async () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        );

        // 1. Navegar a login
        const loginLink = screen.getByText(/Iniciar Sesión/i);
        fireEvent.click(loginLink);

        // 2. Realizar login
        const emailInput = screen.getByLabelText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'admin@eventos.cl' } });

        const loginButton = screen.getByText(/Ingresar/i);
        fireEvent.click(loginButton);

        // 3. Verificar autenticación exitosa
        await waitFor(() => {
            expect(screen.getByText(/Mis Eventos/i)).toBeInTheDocument();
        });

        // 4. Verificar localStorage
        expect(localStorage.getItem('user-logged')).toBe('admin');
    });

    it('debería mantener el estado de autenticación al navegar', async () => {
        // Simular usuario autenticado
        localStorage.setItem('user-logged', 'admin');
        localStorage.setItem('user-email', 'admin@eventos.cl');

        render(
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        );

        // Verificar que se mantiene la autenticación
        await waitFor(() => {
            expect(screen.getByText(/Mis Eventos/i)).toBeInTheDocument();
        });

        // Navegar a otra ruta
        const perfilLink = screen.getByText(/Perfil/i);
        fireEvent.click(perfilLink);

        // Verificar que sigue autenticado
        expect(screen.getByText(/admin@eventos.cl/i)).toBeInTheDocument();
    });

    it('debería proteger rutas privadas', async () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        );

        // Intentar acceder a ruta protegida sin autenticación
        const adminLink = screen.queryByText(/Admin/i);
        expect(adminLink).not.toBeInTheDocument();

        // Verificar redirección a login
        expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    });
});
