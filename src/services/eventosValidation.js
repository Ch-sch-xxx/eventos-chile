// Validaciones para el servicio de eventos

export const validateEvento = (evento) => {
    // Objeto para almacenar errores de validación
    const errors = {};

    // Validación básica: campos requeridos
    const camposRequeridos = ['titulo', 'fecha', 'lugar', 'tipo', 'descripcion'];
    camposRequeridos.forEach(campo => {
        if (!evento[campo]?.trim()) {
            errors[campo] = `El ${campo} es requerido`;
        }
    });

    // Validación específica: tipo de evento
    if (!['Presencial', 'Streaming'].includes(evento.tipo)) {
        errors.tipo = 'El tipo debe ser Presencial o Streaming';
    }

    // Validación de números: capacidad y precio
    if (!Number.isInteger(evento.capacidad) || evento.capacidad < 0) {
        errors.capacidad = 'La capacidad debe ser un número entero positivo';
    }

    if (!Number.isFinite(evento.precio) || evento.precio < 0) {
        errors.precio = 'El precio debe ser un número positivo';
    }

    // Validación de fecha futura
    if (evento.fecha) {
        const fechaEvento = new Date(evento.fecha);
        const hoy = new Date();

        if (isNaN(fechaEvento.getTime())) {
            errors.fecha = 'La fecha debe tener un formato válido (YYYY-MM-DD)';
        } else if (fechaEvento.setHours(0,0,0,0) < hoy.setHours(0,0,0,0)) {
            errors.fecha = 'La fecha del evento debe ser futura';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const generateEventId = () => {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
