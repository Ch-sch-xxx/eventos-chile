import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedRoute from '../../context/ProtectedRoute';

// Componente de prueba para renderizar dentro del ProtectedRoute
const TestComponent = () => <div>Contenido Protegido</div>;

// Helper para renderizar con AuthContext y Router
const renderWithAuth = (component, initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <AuthProvider>
                {component}
            </AuthProvider>
        </MemoryRouter>
    );
};

describe('ProtectedRoute Component', () => {
    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
        // Mock de window.alert
        global.alert = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Sin Autenticación', () => {
        it('debería redirigir a /auth si no hay sesión activa', () => {
            const { container } = renderWithAuth(
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            );

            // No debería mostrar el contenido protegido
            expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
        });

        it('no debería renderizar children si no está autenticado', () => {
            renderWithAuth(
                <ProtectedRoute>
                    <div data-testid="protected-content">Contenido Privado</div>
                </ProtectedRoute>
            );

            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });
    });

    describe('Con Autenticación como Usuario Regular', () => {
        beforeEach(() => {
            // Simular usuario logueado como 'user'
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');
        });

        it('debería renderizar children si el usuario está autenticado', () => {
            renderWithAuth(
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
        });

        it('debería renderizar múltiples children', () => {
            renderWithAuth(
                <ProtectedRoute>
                    <div>Elemento 1</div>
                    <div>Elemento 2</div>
                    <div>Elemento 3</div>
                </ProtectedRoute>
            );

            expect(screen.getByText('Elemento 1')).toBeInTheDocument();
            expect(screen.getByText('Elemento 2')).toBeInTheDocument();
            expect(screen.getByText('Elemento 3')).toBeInTheDocument();
        });

        it('no debería redirigir a /auth si la sesión es válida', () => {
            const { container } = renderWithAuth(
                <ProtectedRoute>
                    <div data-testid="protected">Contenido</div>
                </ProtectedRoute>
            );

            expect(screen.getByTestId('protected')).toBeInTheDocument();
        });
    });

    describe('Protección por Rol de Admin', () => {
        it('debería redirigir usuario regular si requireAdmin=true', () => {
            // Usuario regular (no admin)
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');

            renderWithAuth(
                <ProtectedRoute requireAdmin={true}>
                    <TestComponent />
                </ProtectedRoute>
            );

            // No debería mostrar el contenido
            expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
        });

        it('debería mostrar alert cuando usuario no tiene permisos de admin', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');

            renderWithAuth(
                <ProtectedRoute requireAdmin={true}>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(global.alert).toHaveBeenCalledWith('No tienes permisos de administrador');
        });

        it('debería renderizar contenido si es admin y requireAdmin=true', () => {
            // Usuario admin
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(
                <ProtectedRoute requireAdmin={true}>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
        });

        it('no debería mostrar alert si el usuario es admin', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(
                <ProtectedRoute requireAdmin={true}>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(global.alert).not.toHaveBeenCalled();
        });
    });

    describe('Prop requireAdmin por Defecto', () => {
        it('requireAdmin debería ser false por defecto', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');

            renderWithAuth(
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            );

            // Usuario regular puede acceder sin requireAdmin
            expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
            expect(global.alert).not.toHaveBeenCalled();
        });

        it('debería permitir acceso a usuario regular cuando requireAdmin no se especifica', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');

            renderWithAuth(
                <ProtectedRoute>
                    <div data-testid="content">Accesible</div>
                </ProtectedRoute>
            );

            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
    });

    describe('Integración con Navigate', () => {
        it('debería usar Navigate con replace=true para evitar bucles', () => {
            // No hay forma directa de testear el prop replace de Navigate
            // pero podemos verificar que el componente no se renderiza
            renderWithAuth(
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            );

            // Sin autenticación, no debe aparecer el contenido
            expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
        });
    });

    describe('Casos Edge', () => {
        it('debería manejar localStorage vacío correctamente', () => {
            localStorage.clear();

            renderWithAuth(
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
        });

        it('debería manejar valores nulos en localStorage', () => {
            localStorage.setItem('user-logged', '');
            localStorage.setItem('user-email', '');

            renderWithAuth(
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
        });

        it('debería funcionar con diferentes tipos de children', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');

            renderWithAuth(
                <ProtectedRoute>
                    <button>Botón</button>
                </ProtectedRoute>
            );

            expect(screen.getByRole('button', { name: 'Botón' })).toBeInTheDocument();
        });

        it('debería funcionar con componentes complejos como children', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            const ComplexComponent = () => (
                <div>
                    <h1>Título</h1>
                    <p>Descripción</p>
                    <button>Acción</button>
                </div>
            );

            renderWithAuth(
                <ProtectedRoute requireAdmin={true}>
                    <ComplexComponent />
                </ProtectedRoute>
            );

            expect(screen.getByText('Título')).toBeInTheDocument();
            expect(screen.getByText('Descripción')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });

    describe('Validación de Props', () => {
        it('debería aceptar requireAdmin como booleano', () => {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', 'admin@test.com');

            renderWithAuth(
                <ProtectedRoute requireAdmin={true}>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
        });

        it('debería funcionar con requireAdmin=false explícitamente', () => {
            localStorage.setItem('user-logged', 'user');
            localStorage.setItem('user-email', 'user@test.com');

            renderWithAuth(
                <ProtectedRoute requireAdmin={false}>
                    <TestComponent />
                </ProtectedRoute>
            );

            expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
        });
    });
});
