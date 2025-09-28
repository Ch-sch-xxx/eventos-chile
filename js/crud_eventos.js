// guardamos todos los eventos como una bd, pero esta es local,
// o sea, cargan en el navegador y no en el servidor
// y no se guardan en la nube, son datos temporales

// obtener eventos desde localStorage
function obtenerEventos() {
    const eventos = localStorage.getItem('eventos-chile');
    if (eventos) {
        return JSON.parse(eventos); // Convierte string a array
    } else {
        // Si no hay eventos, creamos algunos
        const eventosIniciales = [
            {
                titulo: "Festival de Música Urbana",
                fecha: "2025-09-30",
                lugar: "Estadio Nacional, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Conferencia de IA",
                fecha: "2025-10-05",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Feria del Libro",
                fecha: "2025-10-12",
                lugar: "Centro Cultural La Moneda, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Taller de Fotografía",
                fecha: "2025-10-18",
                lugar: "Museo de Arte Contemporáneo, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Seminario de Emprendimiento",
                fecha: "2025-10-22",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Concierto Sinfónico",
                fecha: "2025-10-25",
                lugar: "Teatro Municipal, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Hackathon Tech",
                fecha: "2025-11-02",
                lugar: "Universidad de Chile, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Webinar de Finanzas",
                fecha: "2025-11-08",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Festival de Cine",
                fecha: "2025-11-15",
                lugar: "Centro Cultural Gabriela Mistral, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Clase Magistral de Cocina",
                fecha: "2025-11-20",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png"
            }
        ];
        localStorage.setItem('eventos-chile', JSON.stringify(eventosIniciales));
        return eventosIniciales;
    }
}

// guardar eventos en localStorage
function guardarEventos(eventos) {
    localStorage.setItem('eventos-chile', JSON.stringify(eventos));
}

// CREAR nuevo evento CON AUTOR
function crearEvento(nuevoEvento) {
    const userEmail = localStorage.getItem('user-email');
    const eventos = obtenerEventos();

    // Agregar metadatos del autor
    nuevoEvento.creadoPor = userEmail;
    nuevoEvento.fechaCreacion = new Date().toISOString();
    nuevoEvento.id = 'evt_' + Date.now(); // ID único

    eventos.push(nuevoEvento);
    guardarEventos(eventos);
    console.log('Evento creado por:', userEmail, '| Título:', nuevoEvento.titulo);
    return true;
}

// LISTAR
function listarEventos() {
    return obtenerEventos();
}

// EDITAR evento (solo si es el creador o admin)
function editarEvento(indice, eventoEditado) {
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const eventoOriginal = eventos[indice];

        // Verificar permisos
        if (userLogged !== 'admin' && eventoOriginal.creadoPor !== userEmail) {
            console.error('Sin permisos para editar este evento');
            return false;
        }

        // Mantener metadatos originales y agregar actualización
        eventoEditado.creadoPor = eventoOriginal.creadoPor;
        eventoEditado.fechaCreacion = eventoOriginal.fechaCreacion;
        eventoEditado.id = eventoOriginal.id;
        eventoEditado.fechaActualizacion = new Date().toISOString();
        eventoEditado.actualizadoPor = userEmail;

        eventos[indice] = eventoEditado;
        guardarEventos(eventos);
        console.log('Evento editado:', eventoEditado.titulo);
        return true;
    }
    return false;
}

// ELIMINAR evento (solo si es el creador o admin)
function eliminarEvento(indice) {
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const evento = eventos[indice];

        // Verificar permisos
        if (userLogged !== 'admin' && evento.creadoPor !== userEmail) {
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


// funciones para filtrar eventos
function obtenerEventosPorUsuario(email) {
    const eventos = obtenerEventos();
    return eventos.filter(evento => evento.creadoPor === email);
}

function contarEventosUsuario(email) {
    return obtenerEventosPorUsuario(email).length;
}

function contarTotalUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
    return usuarios.length;
}