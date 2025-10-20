import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EventCarousel from '../../components/EventCarousel';
import { AuthProvider } from '../../context/AuthContext';

// Mock de createPortal para evitar errores de renderizado
vi.mock('react-dom', async () => {
    const actual = await vi.importActual('react-dom');
    return {
        ...actual,
        createPortal: (node) => node
    };
});

// Eventos de prueba - USAR campos correctos: titulo, lugar, tipo (NO nombre, ubicacion)
const mockEventos = [
    {
        id: 'evt_1',
        titulo: 'Concierto Rock',
        fecha: '2024-12-25',
        lugar: 'Santiago',
        tipo: 'Música',
        imagen: 'https://via.placeholder.com/300x200'
    },
    {
        id: 'evt_2',
        titulo: 'Festival de Jazz',
        fecha: '2024-12-30',
        lugar: 'Valparaíso',
        tipo: 'Festival',
        imagen: 'https://via.placeholder.com/300x200'
    },
    {
        id: 'evt_3',
        titulo: 'Teatro Musical',
        fecha: '2025-01-05',
        lugar: 'Concepción',
        tipo: 'Teatro',
        imagen: 'https://via.placeholder.com/300x200'
    }
];

// Helper para renderizar con contextos necesarios
const renderWithContext = (component) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                {component}
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('EventCarousel Component', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('Renderizado Básico', () => {
        it('debería renderizar el carrusel correctamente', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            expect(screen.getAllByText('Concierto Rock')[0]).toBeInTheDocument();
        });        it('debería renderizar todos los eventos proporcionados', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            expect(screen.getAllByText('Concierto Rock').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Festival de Jazz').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Teatro Musical').length).toBeGreaterThan(0);
        });

        it('debería manejar array vacío sin crashear', () => {
            const { container } = renderWithContext(<EventCarousel eventos={[]} />);

            // Con array vacío, no debe renderizar tarjetas
            const carrusel = container.querySelector('.carrusel-lista');
            expect(carrusel).toBeInTheDocument();
            expect(carrusel.children.length).toBe(0);
        });

        it('debería duplicar eventos para crear loop infinito', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            // Los eventos se duplican, por lo que deberían aparecer exactamente 2 veces
            const conciertoElements = screen.getAllByText('Concierto Rock');
            expect(conciertoElements.length).toBe(2);
        });
    });

    describe('Información de Eventos', () => {
        it('debería mostrar el título del evento', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            expect(screen.getAllByText('Concierto Rock')[0]).toBeInTheDocument();
        });

        it('debería mostrar el lugar del evento', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            expect(screen.getAllByText((content, element) => {
                return element?.textContent?.includes('Santiago');
            })[0]).toBeInTheDocument();
        });

        it('debería mostrar el tipo del evento', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            expect(screen.getAllByText('Música')[0]).toBeInTheDocument();
        });

        it('debería renderizar las imágenes de los eventos', () => {
            const { container } = renderWithContext(<EventCarousel eventos={mockEventos} />);

            const images = container.querySelectorAll('img.imagen-evento');
            expect(images.length).toBeGreaterThan(0);
        });
    });

    describe('Botón de Asistir', () => {
        it('debería mostrar botones "Asistir al Evento"', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            const buttons = screen.getAllByRole('button', { name: /Asistir al Evento/i });
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('el botón debería tener clase "btn-asistir"', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            const button = screen.getAllByRole('button', { name: /Asistir al Evento/i })[0];
            expect(button).toHaveClass('btn-asistir');
        });
    });

    describe('Estructura HTML', () => {
        it('debería usar article para cada evento (class Tarjetas)', () => {
            const { container } = renderWithContext(<EventCarousel eventos={mockEventos} />);

            const articles = container.querySelectorAll('article.Tarjetas');
            expect(articles.length).toBe(6); // 3 eventos x 2 (duplicados)
        });

        it('debería tener contenedor con ID "carrusel-lista"', () => {
            const { container } = renderWithContext(<EventCarousel eventos={mockEventos} />);

            const carrusel = container.querySelector('#carrusel-lista');
            expect(carrusel).toBeInTheDocument();
        });
    });

    describe('Casos Edge', () => {
        it('debería manejar eventos sin imagen usando imagen por defecto', () => {
            const eventosSinImagen = [{
                id: 'evt_999',
                titulo: 'Evento Sin Imagen',
                fecha: '2024-12-31',
                lugar: 'Santiago',
                tipo: 'Cultural'
            }];

            const { container } = renderWithContext(<EventCarousel eventos={eventosSinImagen} />);
            const img = container.querySelector('img.imagen-evento');
            expect(img).toBeInTheDocument();
        });

        it('debería manejar evento único correctamente', () => {
            const unEvento = [mockEventos[0]];

            renderWithContext(<EventCarousel eventos={unEvento} />);

            expect(screen.getAllByText('Concierto Rock').length).toBe(2);
        });

        it('debería truncar títulos largos', () => {
            const eventoTituloLargo = [{
                id: 'evt_long',
                titulo: 'Este es un título extremadamente largo que debería ser truncado a cuarenta caracteres',
                fecha: '2024-12-31',
                lugar: 'Santiago',
                tipo: 'Cultural'
            }];

            renderWithContext(<EventCarousel eventos={eventoTituloLargo} />);
            expect(screen.getAllByText((content) => {
                return content.includes('...') && content.length <= 43;
            }).length).toBeGreaterThan(0);
        });
    });

    describe('Props', () => {
        it('debería recibir y usar prop eventos', () => {
            const customEventos = [{
                id: 'custom_1',
                titulo: 'Evento Custom',
                fecha: '2025-01-01',
                lugar: 'Viña del Mar',
                tipo: 'Festival'
            }];

            renderWithContext(<EventCarousel eventos={customEventos} />);

            expect(screen.getAllByText('Evento Custom')[0]).toBeInTheDocument();
        });

        it('debería manejar prop eventos vacía sin crashear', () => {
            const { container } = renderWithContext(<EventCarousel eventos={[]} />);

            const carrusel = container.querySelector('.carrusel-lista');
            expect(carrusel).toBeInTheDocument();
        });
    });

    describe('Accesibilidad', () => {
        it('las imágenes tienen atributo alt', () => {
            const { container } = renderWithContext(<EventCarousel eventos={mockEventos} />);

            const images = container.querySelectorAll('img.imagen-evento');
            images.forEach(img => {
                expect(img).toHaveAttribute('alt');
            });
        });

        it('los botones deberían ser accesibles por teclado', () => {
            renderWithContext(<EventCarousel eventos={mockEventos} />);

            const buttons = screen.getAllByRole('button', { name: /Asistir al Evento/i });
            buttons.forEach(button => {
                expect(button).toBeVisible();
            });
        });
    });
});
