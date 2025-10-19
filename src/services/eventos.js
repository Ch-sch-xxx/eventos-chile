// Manejo de eventos usando localStorage como base de datos local
// Incluye operaciones CRUD completas (crear, leer, editar, eliminar)

// Importo la imagen desde assets para que Vite resuelva la URL final en build y preview
import eventoIMG from '../assets/eventosIMG.png';

// Importo la función para generar IDs desde el archivo de validaciones
import { generateEventId } from './eventosValidation';

// Clave para guardar los eventos en el navegador
const STORAGE_KEY = 'eventos-chile';

// Lista de eventos de ejemplo que carga cuando no hay nada guardado
// NUEVO: Ahora incluyen campo asistentes para sistema de confirmación
const eventosIniciales = [
    {
        titulo: "Festival de Música Urbana",
        fecha: "2025-09-30",
        lugar: "Estadio Nacional, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Un festival con los mejores exponentes de la música urbana nacional e internacional.",
        capacidad: 45000,
        precio: 25000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_1",
        asistentes: [], // Array para guardar asistentes confirmados
        totalAsistentes: 0
    },
    {
        titulo: "Conferencia de IA",
        fecha: "2025-10-05",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Expertos en inteligencia artificial presentan las últimas tendencias y avances.",
        capacidad: 5000,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_2",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Feria del Libro",
        fecha: "2025-10-12",
        lugar: "Centro Cultural La Moneda, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Encuentro cultural con editoriales, escritores y actividades literarias para toda la familia.",
        capacidad: 8000,
        precio: 3000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_3",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Taller de Fotografía",
        fecha: "2025-10-18",
        lugar: "Museo de Arte Contemporáneo, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Taller práctico sobre técnicas de fotografía artística y uso de cámara.",
        capacidad: 150,
        precio: 10000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_4",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Seminario de Emprendimiento",
        fecha: "2025-10-22",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Conferencias sobre innovación, startups y oportunidades de negocio.",
        capacidad: 3000,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_5",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Concierto Sinfónico",
        fecha: "2025-10-25",
        lugar: "Teatro Municipal, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Una presentación especial de la Orquesta Filarmónica con repertorio clásico.",
        capacidad: 1800,
        precio: 15000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_6",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Hackathon Tech",
        fecha: "2025-11-02",
        lugar: "Universidad de Chile, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Competencia intensiva de programación y desarrollo de proyectos tecnológicos.",
        capacidad: 600,
        precio: 5000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_7",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Webinar de Finanzas",
        fecha: "2025-11-08",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Charla en línea sobre inversión, ahorro y estrategias financieras personales.",
        capacidad: 2000,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_8",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Festival de Cine",
        fecha: "2025-11-15",
        lugar: "Centro Cultural Gabriela Mistral, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Proyecciones de películas nacionales e internacionales con paneles de discusión.",
        capacidad: 2500,
        precio: 7000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_9",
        asistentes: [],
        totalAsistentes: 0
    },
    {
        titulo: "Clase Magistral de Cocina",
        fecha: "2025-11-20",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Un chef reconocido enseña técnicas y recetas exclusivas paso a paso.",
        capacidad: 1000,
        precio: 8000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_10",
        asistentes: [],
        totalAsistentes: 0
    }
];

// Obtener eventos desde localStorage o cargar datos iniciales
export function obtenerEventos() {
    try {
        const eventosGuardados = localStorage.getItem(STORAGE_KEY);
        if (eventosGuardados) {
            return JSON.parse(eventosGuardados);
        }
        // Si no hay eventos, inicializar con datos de ejemplo
        guardarEventos(eventosIniciales);
        return eventosIniciales;
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return [];
    }
}

// Guardar eventos en localStorage de forma segura
export function guardarEventos(eventos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
        return true;
    } catch (error) {
        console.error('Error al guardar eventos:', error);
        return false;
    }
}

// Crear nuevo evento con validación de usuario
export function crearEvento(nuevoEvento, userEmail) {
    if (!userEmail?.trim()) {
        console.error('Error: Se requiere un usuario válido para crear eventos');
        return null;
    }

    // Generar metadatos del evento
    const eventoConMetadatos = {
        ...nuevoEvento,
        creadoPor: userEmail,
        fechaCreacion: new Date().toISOString(),
        id: generateEventId(), // Uso la función importada en vez de duplicar el código
        asistentes: [], // Inicializar array de asistentes vacío
        totalAsistentes: 0 // Contador de asistentes
    };

    try {
        const eventos = obtenerEventos();
        eventos.push(eventoConMetadatos);

        if (guardarEventos(eventos)) {
            console.log(`✅ Evento "${nuevoEvento.titulo}" creado por ${userEmail}`);
            return eventoConMetadatos;
        }
        return null;
    } catch (error) {
        console.error('Error al crear evento:', error);
        return null;
    }
}

// Obtener lista completa de eventos
export function listarEventos() {
    return obtenerEventos() || [];
}

// Obtener eventos públicos (igual que listarEventos por ahora)
export function listarEventosPublicos() {
    return listarEventos();
}

/**
 * Editar un evento con validación de permisos
 * @param {number} indice - Índice del evento en el array
 * @param {Object} eventoEditado - Nuevos datos del evento
 * @param {string} userEmail - Email del usuario que edita
 * @param {boolean} isAdmin - Si el usuario es administrador
 * @returns {boolean} - true si se editó correctamente
 */
export function editarEvento(indice, eventoEditado, userEmail, isAdmin) {
    try {
        const eventos = obtenerEventos();

        // Validar índice y obtener evento original
        if (indice < 0 || indice >= eventos.length) {
            console.error('Error: Índice de evento inválido');
            return false;
        }

        const eventoOriginal = eventos[indice];

        // Validar permisos
        if (!isAdmin && eventoOriginal.creadoPor !== userEmail) {
            console.error('Error: Sin permisos para editar este evento');
            return false;
        }

        // Conservar metadatos originales
        const eventoActualizado = {
            ...eventoEditado,
            id: eventoOriginal.id,
            creadoPor: eventoOriginal.creadoPor,
            fechaCreacion: eventoOriginal.fechaCreacion,
            fechaActualizacion: new Date().toISOString(),
            actualizadoPor: userEmail
        };

        eventos[indice] = eventoActualizado;
        const resultado = guardarEventos(eventos);
        if (resultado) {
            console.log(`✅ Evento "${eventoActualizado.titulo}" actualizado correctamente`);
        }
        return resultado;
    } catch (error) {
        console.error('Error al editar evento:', error);
        return false;
    }
}


/**
 * Eliminar un evento con validación de permisos
 * @param {number} indice - Índice del evento a eliminar
 * @param {string} userEmail - Email del usuario que elimina
 * @param {boolean} isAdmin - Si el usuario es administrador
 * @returns {boolean} - true si se eliminó correctamente
 */
export function eliminarEvento(indice, userEmail, isAdmin) {
    try {
        const eventos = obtenerEventos();

        // Validar índice
        if (indice < 0 || indice >= eventos.length) {
            console.error('Error: Índice de evento inválido');
            return false;
        }

        const evento = eventos[indice];

        // Validar permisos
        if (!isAdmin && evento.creadoPor !== userEmail) {
            console.error('Error: Sin permisos para eliminar este evento');
            return false;
        }

        // Eliminar y guardar
        eventos.splice(indice, 1);
        const resultado = guardarEventos(eventos);

        if (resultado) {
            console.log(`✅ Evento "${evento.titulo}" eliminado correctamente`);
        }
        return resultado;
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return false;
    }
}

/**
 * Obtener eventos de un usuario específico
 * @param {string} email - Email del usuario
 * @returns {Array} - Lista de eventos del usuario
 */
export function obtenerEventosPorUsuario(email) {
    if (!email?.trim()) return [];

    try {
        const eventos = obtenerEventos();
        return eventos.filter(evento => evento.creadoPor === email);
    } catch (error) {
        console.error('Error al obtener eventos del usuario:', error);
        return [];
    }
}

/**
 * Cuento cuántos eventos tiene un usuario
 */
export function contarEventosUsuario(email) {
    return obtenerEventosPorUsuario(email).length;
}

/**
 * Contar el total de usuarios registrados en el sistema
 * @returns {number} - Número total de usuarios
 */
export function contarTotalUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        return Array.isArray(usuarios) ? usuarios.length : 0;
    } catch (error) {
        console.error('Error al contar usuarios:', error);
        return 0;
    }
}


// Traigo eventos según el tipo de usuario: admin ve todo, usuario normal solo los suyos
export function obtenerMisEventos(userEmail, isAdmin) {
    if (isAdmin) {
        return obtenerEventos();
    } else {
        return obtenerEventosPorUsuario(userEmail);
    }
}

