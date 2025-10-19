// Validaciones para el servicio de eventos

export const validateEvento = (evento) => {
    const errors = {};

    if (!evento.titulo?.trim()) {
        errors.titulo = 'El título es requerido';
    }

    if (!evento.fecha) {
        errors.fecha = 'La fecha es requerida';
    }

    if (!evento.lugar?.trim()) {
        errors.lugar = 'El lugar es requerido';
    }

    if (!evento.tipo || !['Presencial', 'Streaming'].includes(evento.tipo)) {
        errors.tipo = 'El tipo debe ser Presencial o Streaming';
    }

    if (!evento.descripcion?.trim()) {
        errors.descripcion = 'La descripción es requerida';
    }

    if (typeof evento.capacidad !== 'number' || evento.capacidad < 0) {
        errors.capacidad = 'La capacidad debe ser un número positivo';
    }

    if (typeof evento.precio !== 'number' || evento.precio < 0) {
        errors.precio = 'El precio debe ser un número positivo';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const generateEventId = () => {
    return `evt_${Date.now()}`;
};
