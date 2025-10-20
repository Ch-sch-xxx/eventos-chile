import { describe, expect, it } from 'vitest';
import { generateEventId, validateEvento } from '../../services/eventosValidation';

describe('Validación de Eventos', () => {
    const eventoValido = {
        titulo: "Festival de Música",
        fecha: "2025-12-31",
        lugar: "Estadio Nacional",
        tipo: "Presencial",
        descripcion: "Gran festival de música",
        capacidad: 1000,
        precio: 5000,
        imagen: "ruta/imagen.jpg",
        creadoPor: "test@test.com"
    };

    it('debe validar un evento correcto', () => {
        const { isValid, errors } = validateEvento(eventoValido);
        expect(isValid).toBe(true);
        expect(errors).toEqual({});
    });

    it('debe detectar campos faltantes', () => {
        const eventoIncompleto = { ...eventoValido };
        delete eventoIncompleto.titulo;
        delete eventoIncompleto.fecha;

        const { isValid, errors } = validateEvento(eventoIncompleto);
        expect(isValid).toBe(false);
        expect(errors).toHaveProperty('titulo');
        expect(errors).toHaveProperty('fecha');
    });

    it('debe validar tipos de datos correctos', () => {
        const eventoInvalido = {
            ...eventoValido,
            capacidad: -1,
            precio: 'no es un número'
        };

        const { isValid, errors } = validateEvento(eventoInvalido);
        expect(isValid).toBe(false);
        expect(errors).toHaveProperty('capacidad');
        expect(errors).toHaveProperty('precio');
    });
});

describe('Generación de ID de Eventos', () => {
    it('debe generar IDs únicos', () => {
        const id1 = generateEventId();
        const id2 = generateEventId();
        expect(id1).not.toBe(id2);
        expect(id1).toMatch(/^evt_\d+_[a-z0-9]+$/);
    });
});
