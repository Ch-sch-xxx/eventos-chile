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
                titulo: "Evento de Prueba",
                fecha: "2025-10-15",
                lugar: "Parque Ohiggins, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png"
            },
            {
                titulo: "Streaming Tech",
                fecha: "2025-11-01",
                lugar: "ww.hola.com, Online",
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
