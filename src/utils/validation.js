// Utilidades de validación y seguridad

/**
 * Valida que un nombre solo contenga letras y espacios
 * Permite letras con tildes y ñ
 */
export function validarNombre(nombre) {
    const regex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,50}$/;
    return regex.test(nombre.trim());
}

/**
 * Valida formato de email
 * Permite dominios .com, .cl, .co, etc.
 */
export function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
}

/**
 * Valida RUT chileno usando Módulo 11
 * Formato: 12.345.678-9 o 12345678-9
 */
export function validarRUT(rut) {
    // Limpiar puntos y guión
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').trim().toLowerCase();

    // Validar largo mínimo y que termine en número o 'k'
    if (rutLimpio.length < 8 || !/^[0-9]+[0-9k]$/.test(rutLimpio)) {
        return false;
    }

    const rutNumeros = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    // Calcular DV usando Módulo 11
    let suma = 0;
    let multiplicador = 2;

    for (let i = rutNumeros.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumeros[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' :
                       dvEsperado === 10 ? 'k' :
                       dvEsperado.toString();

    return dv === dvCalculado;
}

/**
 * Valida contraseña
 * Debe tener:
 * - Al menos 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function validarPassword(password) {
    const regexs = {
        minLength: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        numbers: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    };

    const validaciones = {
        minLength: regexs.minLength.test(password),
        uppercase: regexs.uppercase.test(password),
        lowercase: regexs.lowercase.test(password),
        numbers: regexs.numbers.test(password),
        special: regexs.special.test(password)
    };

    return {
        isValid: Object.values(validaciones).every(v => v),
        errors: Object.entries(validaciones)
            .filter(([, valid]) => !valid)
            .map(([key]) => key)
    };
}

/**
 * Hashea una contraseña de forma segura
 * Nota: En producción usar bcrypt o similar
 */
export function hashPassword(password) {
    // Esta es una implementación simple de hash
    // En producción usar bcrypt u otra librería de hash segura
    return Array.from(
        new TextEncoder().encode(password)
    ).reduce(
        (hash, byte) => ((hash << 5) - hash) + byte | 0,
        0
    ).toString(36);
}

/**
 * Formatea un RUT con puntos y guión
 */
export function formatearRUT(rut) {
    // Eliminar puntos y guión
    let valor = rut.replace(/\./g, '').replace(/-/g, '');

    // Obtener dv
    const dv = valor.slice(-1);

    // Obtener cuerpo y agregar puntos
    const cuerpo = valor.slice(0, -1)
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Unir con guión
    return `${cuerpo}-${dv}`;
}
