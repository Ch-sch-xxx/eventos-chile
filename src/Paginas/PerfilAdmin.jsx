import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./../css/PerfilStyle.css";

const REGIONES_Y_COMUNAS = {
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"],
  Valparaíso: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué"],
  Biobío: ["Concepción", "Talcahuano", "Los Ángeles"],
  "O'Higgins": ["Rancagua", "San Fernando", "Machalí"],
};

const DEFAULT_AVATAR = "/imagenes/ICONOperfil.png"; // coloca el archivo en public/imagenes/

function contarEventosUsuario(email) {
  const eventos = JSON.parse(localStorage.getItem("eventos-chile") || "[]");
  return eventos.filter((e) => e.creadoPor === email).length;
}
function contarTotalUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios-chile") || "[]");
  return usuarios.length;
}

export default function Perfil() {
  const role = localStorage.getItem("user-logged"); // 'admin' | 'usuario'
  const emailSesion = localStorage.getItem("user-email") || "";

  const [editMode, setEditMode] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(DEFAULT_AVATAR);
  const [listaEventos, setListaEventos] = useState([]);
  const [badgeEventos, setBadgeEventos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    region: "",
    comuna: "",
    fotoUrl: "",
  });

  const comunasDisponibles = useMemo(
    () => (form.region ? REGIONES_Y_COMUNAS[form.region] || [] : []),
    [form.region]
  );

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosUsuario();
    cargarEventos();
    actualizarEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cargarDatosUsuario() {
    let userData = {};
    const stored = localStorage.getItem("user-data");

    if (role === "admin") {
      if (stored) {
        try {
          userData = JSON.parse(stored);
        } catch {
          userData = {
            name: "Administrador Sistema",
            email: "ad@ad.com",
            region: "Región Metropolitana",
            comuna: "Santiago",
            fotoUrl: DEFAULT_AVATAR,
          };
        }
      } else {
        userData = {
          name: "Administrador Sistema",
          email: "ad@ad.com",
          region: "Región Metropolitana",
          comuna: "Santiago",
          fotoUrl: DEFAULT_AVATAR,
        };
      }
    } else {
      // usuario
      if (stored) {
        try {
          userData = JSON.parse(stored);
        } catch {
          userData = {};
        }
      }
      if (!userData.email) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios-chile") || "[]");
        const u = usuarios.find((x) => x.email === emailSesion);
        if (u) {
          userData = u;
          localStorage.setItem("user-data", JSON.stringify(u));
        } else {
          userData = { name: "Usuario Sin Nombre", email: emailSesion, fotoUrl: DEFAULT_AVATAR };
        }
      }
    }

    // Vista + formulario
    setForm({
      name: userData.name || "",
      email: userData.email || emailSesion,
      region: userData.region || "",
      comuna: userData.comuna || "",
      fotoUrl: userData.fotoUrl || "",
    });
    setFotoPreview(userData.fotoUrl || DEFAULT_AVATAR);
  }

  function cargarEventos() {
    const eventos = JSON.parse(localStorage.getItem("eventos-chile") || "[]");
    const esAdmin = role === "admin";
    const propios = esAdmin ? eventos : eventos.filter((e) => e.creadoPor === emailSesion);
    setListaEventos(propios);
    setBadgeEventos(propios.length);
  }

  function actualizarEstadisticas() {
    if (role === "admin") {
      const totalEventos = JSON.parse(localStorage.getItem("eventos-chile") || "[]").length;
      setBadgeEventos(totalEventos);
      setTotalUsuarios(contarTotalUsuarios());
    } else {
      setBadgeEventos(contarEventosUsuario(emailSesion));
      setTotalUsuarios(0);
    }
  }

  function onChange(e) {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id === "foto-url" ? "fotoUrl" : id]: value }));
    if (id === "foto-url") {
      if (value?.trim()) setFotoPreview(value.trim());
      else setFotoPreview(DEFAULT_AVATAR);
    }
    if (id === "region") {
      // reset comuna al cambiar región
      setForm((f) => ({ ...f, comuna: "" }));
    }
  }

  function guardarPerfil(e) {
    e.preventDefault();

    const nombre = form.name.trim();
    const correo = form.email.trim();
    const region = form.region;
    const comuna = form.comuna;
    const fotoUrl = (form.fotoUrl || "").trim();

    if (!nombre || nombre.length < 3) return alert("El nombre debe tener al menos 3 caracteres");
    if (!correo || !correo.includes("@") || !correo.includes(".")) return alert("Ingresa un email válido");
    if (!region || !comuna) return alert("Selecciona región y comuna");

    const nuevosDatos = {
      name: nombre,
      email: correo,
      region,
      comuna,
      fotoUrl: fotoUrl || DEFAULT_AVATAR,
      fechaActualizacion: new Date().toISOString(),
    };

    try {
      if (role === "admin") {
        localStorage.setItem("user-data", JSON.stringify(nuevosDatos));
      } else {
        const usuarios = JSON.parse(localStorage.getItem("usuarios-chile") || "[]");
        const idx = usuarios.findIndex((u) => u.email === emailSesion);
        if (idx !== -1) {
          const original = usuarios[idx];
          usuarios[idx] = {
            ...original,
            ...nuevosDatos,
            rut: original.rut,
            password: original.password,
            fechaRegistro: original.fechaRegistro,
          };
          localStorage.setItem("usuarios-chile", JSON.stringify(usuarios));
          localStorage.setItem("user-data", JSON.stringify(usuarios[idx]));
        } else {
          return alert("Error: Usuario no encontrado en el sistema");
        }
      }

      if (correo !== emailSesion) {
        localStorage.setItem("user-email", correo);
      }

      alert("✅ Perfil actualizado exitosamente");
      setEditMode(false);
      cargarDatosUsuario();
      actualizarEstadisticas();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar el perfil. Inténtalo de nuevo.");
    }
  }

  return (
    <main className="container my-5 perfil-page">
      {/* HERO PERFIL */}
      <section className="row justify-content-center mb-5">
        <div className="col-lg-8 col-xl-7">
          <div className="card border-0 shadow-lg text-center p-4">
            <div className="imagen-container mx-auto mb-3">
              <div className="anillo-portal-1" />
              <div className="anillo-portal-2" />
              <div className="anillo-portal-3" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <span className="particula-portal" />
              <img
                src={fotoPreview || DEFAULT_AVATAR}
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                alt="Foto de perfil"
                className="imagen-perfil"
              />
            </div>
            <div className="info-basica">
              <h2 className="fw-bold mb-2">{form.name || "Usuario"}</h2>
              <p className="text-muted mb-3">{form.email || emailSesion}</p>
              <span className="badge-rol">{role === "admin" ? "Administrador" : "Usuario"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACCORDION */}
      <section className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="accordion accordion-flush" id="accordionPerfil">
            {/* Item 1 */}
            <div className="accordion-item mb-3 rounded shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseInfo"
                  aria-expanded="true"
                >
                  📋 Mi Información Personal
                </button>
              </h2>
              <div id="collapseInfo" className="accordion-collapse collapse show" data-bs-parent="#accordionPerfil">
                <div className="accordion-body">
                  {!editMode ? (
                    <>
                      <h3 className="h5 mb-4 fw-bold text-center">Información Actual</h3>
                      <div className="vista-datos">
                        <div className="dato-item row mb-3">
                          <div className="col-5 col-md-4">
                            <strong>Nombre:</strong>
                          </div>
                          <div className="col-7 col-md-8">{form.name || "No registrado"}</div>
                        </div>
                        <div className="dato-item row mb-3">
                          <div className="col-5 col-md-4">
                            <strong>Email:</strong>
                          </div>
                          <div className="col-7 col-md-8">{form.email || emailSesion}</div>
                        </div>
                        <div className="dato-item row mb-3">
                          <div className="col-5 col-md-4">
                            <strong>RUT:</strong>
                          </div>
                          <div className="col-7 col-md-8">No registrado</div>
                        </div>
                        <div className="dato-item row mb-3">
                          <div className="col-5 col-md-4">
                            <strong>Región:</strong>
                          </div>
                          <div className="col-7 col-md-8">{form.region || "No registrada"}</div>
                        </div>
                        <div className="dato-item row mb-3">
                          <div className="col-5 col-md-4">
                            <strong>Comuna:</strong>
                          </div>
                          <div className="col-7 col-md-8">{form.comuna || "No registrada"}</div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <button className="btn btn-primary px-5 py-2 fw-bold" onClick={() => setEditMode(true)}>
                          Editar mi información
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="h5 mb-4 fw-bold text-center">Editar Información</h3>
                      <form id="form-perfil" onSubmit={guardarPerfil}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="name" className="form-label">
                              Nombre completo
                            </label>
                            <input id="name" type="text" className="form-control" required value={form.name} onChange={onChange} />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                            <input id="email" type="email" className="form-control" required value={form.email} onChange={onChange} />
                          </div>
                          <div className="col-12">
                            <label htmlFor="foto-url" className="form-label">
                              URL Foto de perfil
                            </label>
                            <input
                              id="foto-url"
                              type="url"
                              className="form-control"
                              placeholder="https://ejemplo.com/foto.jpg"
                              value={form.fotoUrl}
                              onChange={onChange}
                            />
                            <small className="form-text text-muted">Pega la URL de tu imagen de perfil</small>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="region" className="form-label">
                              Región
                            </label>
                            <select id="region" className="form-select" required value={form.region} onChange={onChange}>
                              <option value="">Selecciona región</option>
                              {Object.keys(REGIONES_Y_COMUNAS).map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="comuna" className="form-label">
                              Comuna
                            </label>
                            <select id="comuna" className="form-select" required value={form.comuna} onChange={onChange}>
                              <option value="">Selecciona comuna</option>
                              {comunasDisponibles.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-12 text-center mt-4">
                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold me-2">
                              Guardar cambios
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary px-4 py-2 fw-bold"
                              onClick={() => {
                                setEditMode(false);
                                cargarDatosUsuario();
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Item 2: Mis eventos */}
            <div className="accordion-item mb-3 rounded shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseEventos"
                >
                  🎉 <span id="titulo-eventos" className="ms-1">
                    {role === "admin" ? "Todos los Eventos del Sistema" : "Mis Eventos Creados"}
                  </span>
                  <span className="badge bg-primary ms-2" id="badge-eventos">
                    {badgeEventos}
                  </span>
                </button>
              </h2>
              <div id="collapseEventos" className="accordion-collapse collapse" data-bs-parent="#accordionPerfil">
                <div className="accordion-body">
                  <div id="mis-eventos">
                    <div className="row gy-4 justify-content-center lista-eventos-perfil" id="lista-eventos-perfil">
                      {listaEventos.length === 0 ? (
                        <div className="col-12">
                          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic", padding: "2rem", background: "#f9f9f9", borderRadius: 8 }}>
                            {role === "admin" ? "No hay eventos en el sistema" : "No has creado eventos aún. ¡Crea tu primer evento desde el panel!"}
                          </p>
                        </div>
                      ) : (
                        listaEventos.map((evento, i) => (
                          <div key={i} className="col-md-6 col-lg-4">
                            <div className="evento-perfil-item">
                              <div className="evento-titulo">{evento.titulo}</div>
                              <div className="evento-fecha">📅 {evento.fecha}</div>
                              <div className="evento-tipo">🏷️ {evento.tipo}</div>
                              <div style={{ fontSize: ".85rem", color: "#666", marginTop: ".5rem" }}>📍 {evento.lugar}</div>
                              {role === "admin" && (
                                <div style={{ fontSize: ".8rem", color: "var(--primario)", marginTop: ".4rem", fontWeight: 500 }}>
                                  👤 {evento.creadoPor || "Sistema"}
                                </div>
                              )}
                              <div style={{ fontSize: ".75rem", color: "#999", marginTop: ".4rem" }}>
                                📆 {evento.fechaCreacion ? new Date(evento.fechaCreacion).toLocaleDateString("es-CL") : "N/A"}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 3: Stats */}
            <div className="accordion-item mb-3 rounded shadow-sm">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseStats"
                >
                  📊 Mis Estadísticas
                </button>
              </h2>
              <div id="collapseStats" className="accordion-collapse collapse" data-bs-parent="#accordionPerfil">
                <div className="accordion-body">
                  <div id="stats-usuario">
                    <div className="row g-4 text-center">
                      <div className="col-md-6">
                        <div className="stat-card p-4 rounded shadow-sm">
                          <span className="numero-stat display-4 fw-bold d-block mb-2" id="eventos-creados">
                            {role === "admin" ? JSON.parse(localStorage.getItem("eventos-chile") || "[]").length : contarEventosUsuario(emailSesion)}
                          </span>
                          <span className="label-stat text-muted">Eventos creados</span>
                        </div>
                      </div>
                      {role === "admin" && (
                        <div className="col-md-6" id="stat-usuarios">
                          <div className="stat-card p-4 rounded shadow-sm">
                            <span className="numero-stat display-4 fw-bold d-block mb-2" id="total-usuarios">
                              {totalUsuarios}
                            </span>
                            <span className="label-stat text-muted">Usuarios registrados</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /accordion */}
          </div>
        </div>
      </section>

      {/* Acciones rápidas */}
      <section id="acciones-rapidas" className="row justify-content-center mt-5 mb-5">
        <div className="col-lg-8 col-xl-7">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4">
              <h2 className="card-title h5 mb-4 text-center fw-bold">⚡ Acciones Rápidas</h2>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/eventos" className="btn btn-primary px-4 py-2 fw-bold">
                  Ver todos los eventos
                </Link>
                <Link to="/admin" className="btn btn-primary px-4 py-2 fw-bold">
                  Ir a mi panel
                </Link>
                <Link to="/" className="btn btn-secondary px-4 py-2 fw-bold">
                  Ir al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}