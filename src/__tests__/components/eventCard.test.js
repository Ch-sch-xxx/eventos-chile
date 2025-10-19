import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EventCard from '../../components/EventCard';
import { renderWithAuth } from '../test-utils';

describe('EventCard', () => {
    const mockEvento = {
        id: 'evt_test_1',
        titulo: 'Evento de prueba',
        fecha: '2025-12-31T20:00:00.000Z',
        lugar: 'Lugar de prueba',
        tipo: 'Presencial',
        descripcion: 'Descripción del evento de prueba que es bastante larga para probar el truncado',
        capacidad: 100,
        precio: 5000,
        imagen: 'ruta/imagen.jpg',
        creadoPor: 'test@test.com'
    };

    const mockOnAsistir = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar correctamente', () => {
        renderWithAuth(<EventCard evento={mockEvento} onAsistir={mockOnAsistir} />);

        expect(screen.getByText(mockEvento.titulo)).toBeInTheDocument();
        expect(screen.getByText(mockEvento.lugar)).toBeInTheDocument();
    });

    it('debería truncar textos largos', () => {
        renderWithAuth(<EventCard evento={mockEvento} onAsistir={mockOnAsistir} />);

        const descripcion = screen.getByText(/Descripción del evento/);
        expect(descripcion.textContent.length).toBeLessThan(mockEvento.descripcion.length);
    });

    it('debería formatear la fecha correctamente', () => {
        renderWithAuth(<EventCard evento={mockEvento} onAsistir={mockOnAsistir} />);

        const fechaFormateada = screen.getByText(/31 de diciembre de 2025/);
        expect(fechaFormateada).toBeInTheDocument();
    });

    it('debería llamar onAsistir al hacer click en el botón', () => {
        renderWithAuth(<EventCard evento={mockEvento} onAsistir={mockOnAsistir} />);

        const botonAsistir = screen.getByText(/Asistir/i);
        fireEvent.click(botonAsistir);

        expect(mockOnAsistir).toHaveBeenCalledWith(mockEvento.id);
    });

    it('debería mostrar precio gratuito cuando precio es 0', () => {
        const eventoGratuito = { ...mockEvento, precio: 0 };
        renderWithAuth(<EventCard evento={eventoGratuito} onAsistir={mockOnAsistir} />);

        expect(screen.getByText(/Gratuito/i)).toBeInTheDocument();
    });

    it('debería mostrar la capacidad del evento', () => {
        renderWithAuth(<EventCard evento={mockEvento} onAsistir={mockOnAsistir} />);

        expect(screen.getByText(/100/)).toBeInTheDocument();
    });
});
