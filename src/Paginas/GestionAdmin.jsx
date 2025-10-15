import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { obtenerEventos, guardarEventos } from "../util/localStorage"; // <- usa las utilidades correctas
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/AdminStyle.css";

function Admin() {
  const navigate = useNavigate();

  // UI state
  const [showCrear, setShowCrear] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [userLogged, setUserLogged] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [editIndexGlobal, setEditIndexGlobal] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    fecha: "",
    lugar: "",
    tipo: "",
    imagen: "",
    descripcion: "",
    capacidad: "",
    precio: ""
  });
  const [detalle, setDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Storage helpers (usan la clave 'eventos-chile')
  const loadEventos = () => obtenerEventos();
  const saveEventos = (arr) => guardarEventos(arr);

  const listarEventos = () => loadEventos();

  const obtenerMisEventos = () => {
    const all = loadEventos();
    if (userLogged === "admin") return all;
    return all.filter((e) => e.creadoPor === userEmail);
  };

  const crearEvento = (data) => {
    const all = loadEventos();
    const nuevo = {
      ...data,
      creadoPor: userEmail,
      fechaCreacion: new Date().toISOString(),
      id: "evt_" + Date.now(),
    };
    const next = [...all, nuevo];
    saveEventos(next);
    setEventos(next);
  };

  const editarEvento = (idxGlobal, data) => {
    const all = loadEventos();
    if (idxGlobal < 0 || idxGlobal >= all.length) return;
    const original = all[idxGlobal];
    all[idxGlobal] = {
      ...original,
      ...data,
      id: original.id,
      creadoPor: original.creadoPor,
      fechaCreacion: original.fechaCreacion,
      fechaActualizacion: new Date().toISOString(),
      actualizadoPor: userEmail,
    };
    saveEventos(all);
    setEventos(all);
  };

  const eliminarEvento = (idxGlobal) => {
    const all = loadEventos();
    if (idxGlobal < 0 || idxGlobal >= all.length) return;
    all.splice(idxGlobal, 1);
    saveEventos(all);
    setEventos(all);
  };

  // Session & carga inicial
  useEffect(() => {
    const role = localStorage.getItem("user-logged");
    const email = localStorage.getItem("user-email");
    setUserLogged(role);
    setUserEmail(email);
    // Semilla + carga
    const seeded = loadEventos(); // obtenerEventos() siembra si no existe
    setEventos(seeded);
  }, []);

  // helpers UI
  const resetForm = () => {
    setForm({
      titulo: "",
      fecha: "",
      lugar: "",
      tipo: "",
      imagen: "",
      descripcion: "",
      capacidad: "",
      precio: ""
    });
    setEditIndexGlobal(null);
  };

  const handleNavCrear = (e) => {
    e && e.preventDefault();
    resetForm();
    setShowCrear(true);
  };
  const handleNavListar = (e) => {
    e && e.preventDefault();
    setShowCrear(false);
    setEventos(listarEventos());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validarFormulario = () => {
    if (!form.titulo || form.titulo.trim().length < 3) {
      alert("El título debe tener al menos 3 caracteres");
      return false;
    }
    if (!form.fecha) {
      alert("Selecciona una fecha válida");
      return false;
    }
    if (!form.lugar || form.lugar.trim().length < 3) {
      alert("El lugar debe tener al menos 3 caracteres");
      return false;
    }
    if (!form.tipo) {
      alert("Selecciona el tipo de evento");
      return false;
    }
    const fechaEvento = new Date(form.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaEvento < hoy) {
      alert("La fecha del evento no puede ser anterior a hoy");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!validarFormulario()) return;

    const payload = {
      titulo: form.titulo.trim(),
      fecha: form.fecha,
      lugar: form.lugar.trim(),
      tipo: form.tipo,
      imagen: form.imagen.trim() || "imagenes/eventosIMG.png",
      descripcion: form.descripcion.trim() || "Sin descripción",
      capacidad: parseInt(form.capacidad || "100", 10),
      precio: form.precio.trim() || "Gratis"
    };

    if (editIndexGlobal !== null) {
      const ok = editarEvento(editIndexGlobal, payload);
      if (ok) {
        alert("Evento editado exitosamente!");
        resetForm();
        setShowCrear(false);
        setEventos(listarEventos());
      } else {
        alert("No tienes permisos para editar este evento");
      }
    } else {
      const ok = crearEvento(payload);
      if (ok) {
        alert("Evento creado exitosamente!");
        resetForm();
        setShowCrear(false);
        setEventos(listarEventos());
      } else {
        alert("Error al crear el evento");
      }
    }
  };

  // Cuando el usuario clic en editar en la vista filtrada -> localizar índice global y precargar form
  const iniciarEdicion = (idxEnListado) => {
    const lista = obtenerMisEventos();
    const evento = lista[idxEnListado];
    if (!evento) return alert("Evento no encontrado");
    const all = listarEventos();
    const idxGlobal = all.findIndex((e) => e.id === evento.id);
    // permiso
    if (userLogged !== "admin" && evento.creadoPor !== userEmail) {
      return alert("Solo puedes editar tus propios eventos");
    }
    setEditIndexGlobal(idxGlobal);
    setForm({
      titulo: evento.titulo,
      fecha: evento.fecha,
      lugar: evento.lugar,
      tipo: evento.tipo,
      imagen: evento.imagen,
      descripcion: evento.descripcion || "",
      capacidad: evento.capacidad || "",
      precio: evento.precio || ""
    });
    setShowCrear(true);
  };

  const borrarEventoHandler = (idxEnListado) => {
    const lista = obtenerMisEventos();
    const evento = lista[idxEnListado];
    if (!evento) return alert("Evento no encontrado");
    if (userLogged !== "admin" && evento.creadoPor !== userEmail) {
      return alert("Solo puedes eliminar tus propios eventos");
    }
    if (!confirm(`¿Eliminar "${evento.titulo}"?`)) return;
    const all = listarEventos();
    const idxGlobal = all.findIndex((e) => e.id === evento.id);
    const ok = eliminarEvento(idxGlobal);
    if (ok) {
      setEventos(listarEventos());
      alert("Evento eliminado correctamente");
    } else {
      alert("Error: No se pudo eliminar el evento");
    }
  };

  const verEvento = (idxEnListado) => {
    const lista = obtenerMisEventos();
    const evento = lista[idxEnListado];
    if (!evento) return alert("Evento no encontrado");
    setDetalle(evento);
    setShowModal(true);
  };

  const cerrarSesion = (e) => {
    e && e.preventDefault();
    if (!confirm("¿Seguro que deseas cerrar sesión?")) return;
    localStorage.removeItem("user-logged");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-data");
    alert("Sesión cerrada correctamente");
    navigate("/auth", { replace: true });
  };

  // listado que se muestra (filtrado si no admin)
  const listado = obtenerMisEventos();

  return (
    <div className="admin-wrapper d-flex flex-column min-vh-100">
      <header className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)", minHeight: 80 }}>
        <div className="container-fluid px-4 d-flex align-items-center">
          <h1 id="h1_titulo" className="navbar-brand mb-0 fw-bold">
            {userLogged === "admin" ? "Panel Admin · Eventos Chile" : "Mi Gestor · Eventos Chile"}
          </h1>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navegacionPrincipal">
            <span className="navbar-toggler-icon"></span>
          </button>
          <nav className="collapse navbar-collapse justify-content-end" id="navegacionPrincipal">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <Link to="/eventos" className="nav-link px-3 py-2 rounded-pill">Eventos</Link>
              </li>
              <li className="nav-item">
                <Link to="/perfil" className="nav-link">Mi Perfil</Link>
              </li>
              <li className="nav-item">
                <a onClick={cerrarSesion} className="nav-link px-3 py-2 rounded-pill" href="#" id="cerrar-sesion">Cerrar sesión</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <aside className="col-lg-2 col-md-3 sidebar bg-light border-end p-4">
            <h2 className="h5 mb-3 fw-bold text-dark">Eventos</h2>
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <a href="#" id="nav-crear" onClick={handleNavCrear} className={`nav-link text-dark px-3 py-2 rounded ${showCrear ? "active" : ""}`}>Crear Evento</a>
              </li>
              <li className="nav-item">
                <a href="#" id="nav-listar" onClick={handleNavListar} className={`nav-link text-dark px-3 py-2 rounded ${!showCrear ? "active" : ""}`} aria-current="page">Listar Eventos</a>
              </li>
            </ul>
          </aside>

          <main className="col-lg-10 col-md-9 admin-content p-4">
            {/* Crear */}
            <section id="crear-evento" className={showCrear ? "" : "oculto"}>
              <div className="row justify-content-center">
                <div className="col-xl-10">
                  <div className="card border-0 shadow-lg mb-4">
                    <div className="card-body p-4">
                      <h2 className="card-title h3 mb-4 text-center fw-bold">{editIndexGlobal !== null ? "Editar Evento" : "Crear Evento"}</h2>
                      <form id="form-crear" onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Título</label>
                            <input name="titulo" value={form.titulo} onChange={handleChange} type="text" className="form-control" required minLength={3} placeholder="Nombre del evento" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fecha</label>
                            <input name="fecha" value={form.fecha} onChange={handleChange} type="date" className="form-control" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Lugar</label>
                            <input name="lugar" value={form.lugar} onChange={handleChange} type="text" className="form-control" required placeholder="Ubicación del evento" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Tipo</label>
                            <select name="tipo" value={form.tipo} onChange={handleChange} className="form-select" required>
                              <option value="">Selecciona tipo</option>
                              <option>Presencial</option>
                              <option>Streaming</option>
                              <option>Consumo</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">URL Imagen</label>
                            <input name="imagen" value={form.imagen} onChange={handleChange} type="url" className="form-control" placeholder="https://..." />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Capacidad</label>
                            <input name="capacidad" value={form.capacidad} onChange={handleChange} type="number" className="form-control" min="1" placeholder="100" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Precio</label>
                            <input name="precio" value={form.precio} onChange={handleChange} type="text" className="form-control" placeholder="Gratis o $5000" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Descripción</label>
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3" className="form-control" placeholder="Detalles del evento"></textarea>
                          </div>
                          <div className="col-12 text-center mt-4">
                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">{editIndexGlobal !== null ? "Guardar Cambios" : "Crear Evento"}</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Listar */}
            <section id="listar-eventos" className={showCrear ? "oculto" : ""}>
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <h2 className="card-title h3 mb-4 text-center fw-bold">{userLogged === "admin" ? "Gestión de Eventos (Administrador)" : "Mis Eventos Creados"}</h2>
                  <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Imagen</th>
                          <th>Título</th>
                          <th>Fecha</th>
                          <th>Lugar</th>
                          <th>Tipo</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listado.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                              No tienes eventos creados aún. ¡Crea tu primer evento!
                            </td>
                          </tr>
                        ) : listado.map((evento, i) => {
                          const autor = evento.creadoPor || "Sistema";
                          const esMiEvento = evento.creadoPor === userEmail;
                          const puedeEditar = userLogged === "admin" || esMiEvento;
                          return (
                            <tr key={evento.id}>
                              <td>{i + 1}</td>
                              <td>
                                <img src={evento.imagen} alt="Evento" className="img-fluid rounded" style={{ width: 60, height: 50, objectFit: "cover" }} onError={(e)=>{e.currentTarget.src = "imagenes/eventosIMG.png";}} />
                              </td>
                              <td>
                                <strong>{evento.titulo}</strong><br />
                                <small style={{ color: "#666" }}>Por: {autor}</small>
                                {esMiEvento ? <><br /><span style={{ color: "var(--primario)", fontSize: ".75rem", fontWeight: 600 }}>● Tu evento</span></> : null}
                              </td>
                              <td>{evento.fecha}</td>
                              <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{evento.lugar}</td>
                              <td>
                                <span className="badge" style={{ background: "var(--acento)", color: "white", fontSize: ".8rem" }}>{evento.tipo}</span>
                              </td>
                              <td>
                                <button className="btn-ver" style={{ marginRight: 6 }} onClick={() => verEvento(i)}>Ver</button>
                                {puedeEditar ? <button className="btn-editar" onClick={() => iniciarEdicion(i)} style={{ marginRight: 6 }}>Editar</button> : null}
                                {puedeEditar ? <button className="btn-eliminar" onClick={() => borrarEventoHandler(i)}>Eliminar</button> : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Modal (simple) */}
      {showModal && detalle && (
        <>
          <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h3 className="modal-title fw-bold">Detalle del Evento</h3>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <img src={detalle.imagen} alt="Imagen Evento" className="img-fluid rounded shadow-sm mb-3" style={{ maxWidth: 300 }} onError={(e)=>{e.currentTarget.src = "imagenes/eventosIMG.png";}} />
                  <h4 className="fw-bold mb-3">{detalle.titulo}</h4>
                  <div className="text-start">
                    <p className="mb-2"><strong>📅 Fecha:</strong> <span>{detalle.fecha}</span></p>
                    <p className="mb-2"><strong>📍 Lugar:</strong> <span>{detalle.lugar}</span></p>
                    <p className="mb-2"><strong>🎭 Tipo:</strong> <span>{detalle.tipo}</span></p>
                    <p className="mb-2"><strong>📋 Descripción:</strong> <span>{detalle.descripcion || "Sin descripción"}</span></p>
                    <p className="mb-2"><strong>👥 Capacidad:</strong> <span>{detalle.capacidad || "No informada"}</span></p>
                    <p className="mb-2"><strong>💰 Precio:</strong> <span>{detalle.precio || "Gratis"}</span></p>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="mt-5 py-4 text-white admin-footer" style={{ background: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)" }}>
        <div className="container text-center">
          <p className="mb-2" id="contacto">
            Contacto:
            <a id="mail" href="mailto:eventoschile@gmail.com" className="text-info text-decoration-none"> eventoschile@gmail.com </a>
          </p>
          <p className="mb-0">
            <a id="Ftnosotros" href="/" className="text-info text-decoration-none"> Acerca de Nosotros </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Admin;