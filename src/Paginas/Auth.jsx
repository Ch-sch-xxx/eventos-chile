import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  obtenerUsuarios,
  crearUsuario,
  validarUsuario,
  formatearRUT,
  validarRUTCompleto,
  regionesYcomunas
} from '../util/auth';
import '../css/StyleAuth.css';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const [login, setLogin] = useState({ email: '', password: '' });
  const [register, setRegister] = useState({
    name: '',
    email: '',
    rut: '',
    password: '',
    region: '',
    comuna: ''
  });
  const [comunas, setComunas] = useState([]);

  useEffect(() => {
    // actualizar comunas cuando cambia la región
    setComunas(regionesYcomunas[register.region] || []);
    if (!regionesYcomunas[register.region]) {
      setRegister(r => ({ ...r, comuna: '' }));
    }
  }, [register.region]);

  function onChangeLogin(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }

  function onChangeRegister(e) {
    const { name, value } = e.target;
    if (name === 'rut') {
      // formatear RUT con la util
      setRegister(prev => ({ ...prev, rut: formatearRUT(value) }));
    } else {
      setRegister(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = login.email.trim();
    const pass = login.password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email inválido');
      return;
    }
    if (pass.length < 4 || pass.length > 20) {
      alert('La contraseña debe tener entre 4 y 20 caracteres');
      return;
    }

    // Admin hardcodeado
    if (email === 'ad@ad.com' && pass === 'admin') {
      localStorage.setItem('user-logged', 'admin');
      localStorage.setItem('user-email', email);
      localStorage.setItem(
        'user-data',
        JSON.stringify({ name: 'Administrador', email, role: 'admin' })
      );
      alert('¡Bienvenido Administrador!');
      navigate('/gestion_admin');
      return;
    }

    const usuario = validarUsuario(email, pass);
    if (usuario) {
      localStorage.setItem('user-logged', 'usuario');
      localStorage.setItem('user-email', email);
      localStorage.setItem('user-data', JSON.stringify(usuario));
      alert('¡Bienvenido ' + usuario.name + '!');
      navigate('/gestion_admin');
    } else {
      alert('Credenciales incorrectas');
    }
  }

  function handleRegister(e) {
    e.preventDefault();
    const { name, email, rut, password, region, comuna } = register;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      alert('Email inválido');
      return;
    }
    if (!rut || !validarRUTCompleto(rut)) {
      alert('RUT inválido. Usar formato: 12.345.678-9 o 12345678-9');
      return;
    }
    if (password.length < 4 || password.length > 20) {
      alert('La contraseña debe tener entre 4 y 20 caracteres');
      return;
    }
    if (!region || !comuna) {
      alert('Selecciona región y comuna');
      return;
    }

    const usuarios = obtenerUsuarios();
    if (usuarios.find(u => u.rut === formatearRUT(rut))) {
      alert('Este RUT ya está registrado');
      return;
    }

    const nuevoUsuario = {
      name: name.trim(),
      email: email.trim(),
      rut: formatearRUT(rut),
      password,
      region,
      comuna,
      fechaRegistro: new Date().toISOString()
    };

    if (crearUsuario(nuevoUsuario)) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      setRegister({ name: '', email: '', rut: '', password: '', region: '', comuna: '' });
      setMode('login');
    } else {
      alert('Este email ya está registrado');
    }
  }

  return (
    <div>
      <main className="container my-5">
        <section className="row justify-content-center">
          <div className="col-lg-6 col-xl-5">
            <div className="auth-contenedor">
              {mode === 'login' && (
                <form id="login" className="auth-form" onSubmit={handleLogin}>
                  <h2 className="text-center mb-4">Iniciar sesión</h2>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input name="email" value={login.email} onChange={onChangeLogin} type="email" className="form-control" required placeholder="ejemplo-correo@dominio.cl" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input name="password" value={login.password} onChange={onChangeLogin} type="password" className="form-control" required minLength={4} maxLength={20} placeholder="Contraseña" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Entrar</button>
                  <p className="text-center mt-3 mb-0">¿No tienes cuenta? <button type="button" className="btn btn-link p-0" onClick={() => setMode('register')}>Regístrate</button></p>
                </form>
              )}

              {mode === 'register' && (
                <form id="register" className="auth-form" onSubmit={handleRegister}>
                  <h2 className="text-center mb-4">Registro</h2>
                  <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input name="name" value={register.name} onChange={onChangeRegister} type="text" className="form-control" required placeholder="Tu nombre completo" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input name="email" value={register.email} onChange={onChangeRegister} type="email" className="form-control" required placeholder="ejemplo-correo@dominio.cl" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">RUT chileno</label>
                    <input name="rut" value={register.rut} onChange={onChangeRegister} type="text" className="form-control" required placeholder="12345678-9" maxLength={12} />
                    <small className="form-text text-muted">Formato: 12345678-9</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input name="password" value={register.password} onChange={onChangeRegister} type="password" className="form-control" required minLength={4} maxLength={20} placeholder="Contraseña" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Región</label>
                    <select name="region" value={register.region} onChange={onChangeRegister} className="form-select" required>
                      <option value="">Selecciona región</option>
                      {Object.keys(regionesYcomunas).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comuna</label>
                    <select name="comuna" value={register.comuna} onChange={onChangeRegister} className="form-select" required>
                      <option value="">Selecciona comuna</option>
                      {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Registrar</button>
                  <p className="text-center mt-3 mb-0">¿Ya tienes cuenta? <button type="button" className="btn btn-link p-0" onClick={() => setMode('login')}>Inicia sesión</button></p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

    
    </div>
  );
}