// Manejo de eventos usando localStorage como base de datos local
// Incluye operaciones CRUD completas (crear, leer, editar, eliminar)

// Clave para guardar los eventos en el navegador
const STORAGE_KEY = 'eventos-chile';

// Lista de eventos de ejemplo que carga cuando no hay nada guardado
const eventosIniciales = [
    {
        titulo: "Festival de Música Urbana",
        fecha: "2025-09-30",
        lugar: "Estadio Nacional, Santiago",
        tipo: "Presencial",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Un festival con los mejores exponentes de la música urbana nacional e internacional.",
        capacidad: 45000,
        precio: 25000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_1"
    },
    {
        titulo: "Conferencia de IA",
        fecha: "2025-10-05",
        lugar: "Online",
        tipo: "Streaming",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Expertos en inteligencia artificial presentan las últimas tendencias y avances.",
        capacidad: 5000,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_2"
    },
    {
        titulo: "Feria del Libro",
        fecha: "2025-10-12",
        lugar: "Centro Cultural La Moneda, Santiago",
        tipo: "Presencial",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Encuentro cultural con editoriales, escritores y actividades literarias para toda la familia.",
        capacidad: 8000,
        precio: 3000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_3"
    },
    {
        titulo: "Taller de Fotografía",
        fecha: "2025-10-18",
        lugar: "Museo de Arte Contemporáneo, Santiago",
        tipo: "Presencial",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Taller práctico sobre técnicas de fotografía artística y uso de cámara.",
        capacidad: 150,
        precio: 10000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_4"
    },
    {
        titulo: "Seminario de Emprendimiento",
        fecha: "2025-10-22",
        lugar: "Online",
        tipo: "Streaming",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Conferencias sobre innovación, startups y oportunidades de negocio.",
        capacidad: 3000,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_5"
    },
    {
        titulo: "Concierto Sinfónico",
        fecha: "2025-10-25",
        lugar: "Teatro Municipal, Santiago",
        tipo: "Presencial",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Una presentación especial de la Orquesta Filarmónica con repertorio clásico.",
        capacidad: 1800,
        precio: 15000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_6"
    },
    {
        titulo: "Hackathon Tech",
        fecha: "2025-11-02",
        lugar: "Universidad de Chile, Santiago",
        tipo: "Presencial",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Competencia intensiva de programación y desarrollo de proyectos tecnológicos.",
        capacidad: 600,
        precio: 5000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_7"
    },
    {
        titulo: "Webinar de Finanzas",
        fecha: "2025-11-08",
        lugar: "Online",
        tipo: "Streaming",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Charla en línea sobre inversión, ahorro y estrategias financieras personales.",
        capacidad: 2000,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_8"
    },
    {
        titulo: "Festival de Cine",
        fecha: "2025-11-15",
        lugar: "Centro Cultural Gabriela Mistral, Santiago",
        tipo: "Presencial",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Proyecciones de películas nacionales e internacionales con paneles de discusión.",
        capacidad: 2500,
        precio: 7000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_9"
    },
    {
        titulo: "Clase Magistral de Cocina",
        fecha: "2025-11-20",
        lugar: "Online",
        tipo: "Streaming",
        imagen: "imagenes/eventosIMG.png",
        descripcion: "Un chef reconocido enseña técnicas y recetas exclusivas paso a paso.",
        capacidad: 1000,
        precio: 8000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_10"
    }
];

// Traigo los eventos guardados en localStorage o cargo los iniciales si no hay nada
export function obtenerEventos() {
    const eventos = localStorage.getItem(STORAGE_KEY);
    if (eventos) {
        return JSON.parse(eventos);
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventosIniciales));
        return eventosIniciales;
    }
}

// Guardo los eventos en localStorage
export function guardarEventos(eventos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
}

// Creo un nuevo evento y lo asocio al usuario que lo creó
export function crearEvento(nuevoEvento, userEmail) {
    const eventos = obtenerEventos();

    // Validar que haya email (el componente debe enviarlo)
    if (!userEmail) {
        console.error('No hay usuario logueado');
        return false;
    }

    // Agrego metadatos al evento
    const eventoConMetadatos = {
        ...nuevoEvento,
        creadoPor: userEmail,
        fechaCreacion: new Date().toISOString(),
        id: 'evt_' + Date.now()
    };

    eventos.push(eventoConMetadatos);
    guardarEventos(eventos);
    console.log('Evento creado por:', userEmail, '| Título:', nuevoEvento.titulo);
    return true;
}

// Listo todos los eventos guardados
export function listarEventos() {
    return obtenerEventos();
}

export function listarEventosPublicos() {
    return obtenerEventos();
}

// Alias para listar eventos (lo usamos en la vista pública)
export function listarEventosPublicos() {
    return obtenerEventos();
}

/**
* Edito un evento si tengo permisos (creador o admin)
* @param {number} indice - Posición del evento en el array
* @param {Object} eventoEditado - Nuevos datos del evento
* @param {string} userEmail - Email del usuario que edita
* @param {boolean} isAdmin - Si el usuario es admin
* @returns {boolean} - true si se editó, false si no hay permisos
*/
export function editarEvento(indice, eventoEditado, userEmail, isAdmin) {
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const eventoOriginal = eventos[indice];

        // Solo el creador o admin pueden editar
        if (!isAdmin && eventoOriginal.creadoPor !== userEmail) {
            console.error('Sin permisos para editar este evento');
            return false;
        }

        // Conservo datos originales y agrego registro de actualización
        const eventoActualizado = {
            ...eventoEditado,
            creadoPor: eventoOriginal.creadoPor,
            fechaCreacion: eventoOriginal.fechaCreacion,
            id: eventoOriginal.id,
            fechaActualizacion: new Date().toISOString(),
            actualizadoPor: userEmail
        };

        eventos[indice] = eventoActualizado;
        guardarEventos(eventos);
        console.log('Evento editado:', eventoActualizado.titulo);
        return true;
    }
    return false;
}


// Elimino un evento si tengo permisos (creador o admin)
export function eliminarEvento(indice, userEmail, isAdmin) {
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const evento = eventos[indice];

        // Solo el creador o admin pueden eliminar
        if (!isAdmin && evento.creadoPor !== userEmail) {
            console.error('Sin permisos para eliminar este evento');
            return false;
        }

        const eventoEliminado = eventos.splice(indice, 1)[0];
        guardarEventos(eventos);
        console.log('Evento eliminado:', eventoEliminado.titulo);
        return true;
    }
    return false;
}

// Filtro eventos de un usuario específico
export function obtenerEventosPorUsuario(email) {
    const eventos = obtenerEventos();
    return eventos.filter(evento => evento.creadoPor === email);
}

/**
 * Cuento cuántos eventos tiene un usuario
 */
export function contarEventosUsuario(email) {
    return obtenerEventosPorUsuario(email).length;
}

// Cuento cuántos eventos tiene un usuario
export function contarEventosUsuario(email) {
    return obtenerEventosPorUsuario(email).length;
}

// Cuento el total de usuarios registrados en el sistema
export function contarTotalUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
    return usuarios.length;
}


// Traigo eventos según el tipo de usuario: admin ve todo, usuario normal solo los suyos
export function obtenerMisEventos(userEmail, isAdmin) {
    if (isAdmin) {
        return obtenerEventos();
    } else {
        return obtenerEventosPorUsuario(userEmail);
    }
}
