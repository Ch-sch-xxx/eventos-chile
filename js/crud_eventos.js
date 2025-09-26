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

// CREAR nuevo evento
function crearEvento(nuevoEvento) {
    const eventos = obtenerEventos(); // Obtenemos lista actual
    eventos.push(nuevoEvento); // Agregamos
    guardarEventos(eventos); // Guardamos todo
    console.log('Evento creado:', nuevoEvento.titulo);
}

// LISTAR
function listarEventos() {
    return obtenerEventos();
}

// EDITAR un evento existente por índice
function editarEvento(indice, eventoEditado) {
    const eventos = obtenerEventos();
    if (indice >= 0 && indice < eventos.length) {
        eventos[indice] = eventoEditado; // Reemplazamos el evento
        guardarEventos(eventos);
        console.log('Evento editado:', eventoEditado.titulo);
        return true;
    }
    return false;
}

// ELIMINAR un evento por índice
function eliminarEvento(indice) {
    const eventos = obtenerEventos();
    if (indice >= 0 && indice < eventos.length) {
        const eventoEliminado = eventos.splice(indice, 1)[0]; // Lo saca del array
        guardarEventos(eventos);
        console.log('Evento eliminado:', eventoEliminado.titulo);
        return true;
    }
    return false;
}
