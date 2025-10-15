export function obtenerUsuarios() {
  const usuarios = localStorage.getItem('usuarios-chile');
  return usuarios ? JSON.parse(usuarios) : [];
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
}

export function crearUsuario(userData) {
  const usuarios = obtenerUsuarios();
  if (usuarios.find(user => user.email === userData.email)) {
    return false;
  }
  usuarios.push(userData);
  guardarUsuarios(usuarios);
  return true;
}

export function validarUsuario(email, password) {
  const usuarios = obtenerUsuarios();
  return usuarios.find(user => user.email === email && user.password === password);
}

export function calcularDV(rutSinDV) {
  let suma = 0;
  let multiplicador = 2;
  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    const digito = parseInt(rutSinDV.charAt(i), 10);
    suma += digito * multiplicador;
    multiplicador++;
    if (multiplicador > 7) multiplicador = 2;
  }
  const resto = suma % 11;
  const dv = 11 - resto;
  if (dv === 11) return '0';
  if (dv === 10) return 'k';
  return dv.toString();
}

export function validarRUTCompleto(rut) {
  const rutLimpio = rut.replace(/[^0-9kK-]/g, '');
  if (!/^[0-9]+-[0-9kK]$/i.test(rutLimpio)) return false;
  const partes = rutLimpio.split('-');
  const cuerpo = partes[0];
  const dv = partes[1].toLowerCase();
  if (cuerpo.length < 7 || cuerpo.length > 8) return false;
  const dvCalculado = calcularDV(cuerpo);
  return dv === dvCalculado;
}

export function formatearRUT(rut) {
  let rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (rutLimpio.length < 2) return rutLimpio;
  const dv = rutLimpio.slice(-1);
  const cuerpo = rutLimpio.slice(0, -1);
  if (cuerpo.length === 0) return rutLimpio;
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpoFormateado}-${dv}`;
}

export const regionesYcomunas = {
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué"],
  "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
  "O'Higgins": ["Rancagua", "San Fernando", "Machalí"]
};