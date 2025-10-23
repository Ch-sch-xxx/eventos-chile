// Utilidades de validación y seguridad

/**
 * Calcula el dígito verificador de un RUT usando algoritmo Módulo 11
 * Esta función se exporta para que pueda usarse en otros lugares
 */
export function calcularDV(rutSinDV) {
    let suma = 0;
    let multiplicador = 2;

    // Recorrer de DERECHA a IZQUIERDA
    for (let i = rutSinDV.length - 1; i >= 0; i--) {
        const digito = parseInt(rutSinDV.charAt(i));
        suma += digito * multiplicador;

        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resto = suma % 11;
    const dv = 11 - resto;

    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return dv.toString();
}

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
 * Reglas:
 * - Debe tener un @ y un punto
 * - Dominio principal debe tener al menos 2 caracteres
 * - Extensión debe tener al menos 2 caracteres (.com, .cl, .technology, etc)
 * - No permite dominios incompletos como a@b.c
 */
export function validarEmail(email) {
    // Primero limpiamos el email
    const emailLimpio = email.trim().toLowerCase();

    // Validación básica de formato (cambié {2,6} a {2,} para aceptar dominios largos)
    const formatoBasico = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formatoBasico.test(emailLimpio)) {
        return false;
    }

    // Validaciones adicionales
    const [, dominio] = emailLimpio.split('@');
    const partesDominio = dominio.split('.');

    // El dominio principal debe tener al menos 2 caracteres
    if (partesDominio[0].length < 2) {
        return false;
    }

    return true;
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

    // Separar cuerpo del RUT y dígito verificador
    const rutNumeros = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    // Usar la función calcularDV en vez de duplicar el código
    const dvCalculado = calcularDV(rutNumeros);

    return dv === dvCalculado;
}

/**
 * Valida contraseña con requisitos de seguridad
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function validarPassword(password) {
    const errores = [];
    
    if (!password || password.length < 8) {
        errores.push('Debe tener al menos 8 caracteres');
    }
    
    if (password.length > 50) {
        errores.push('No debe exceder 50 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
        errores.push('Debe incluir al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
        errores.push('Debe incluir al menos una letra minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
        errores.push('Debe incluir al menos un número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errores.push('Debe incluir al menos un carácter especial (!@#$%^&*()_+-=[]{}...)');
    }
    
    return {
        isValid: errores.length === 0,
        errores: errores
    };
}

/**
 * Hashea una contraseña (simulación simple de hash de 64 caracteres)
 * Nota: En producción usar bcrypt o similar
 */
export function hashPassword(password) {
    // Implementación simple que siempre devuelve 64 caracteres hexadecimales
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Convertir a string hex y extender a 64 caracteres
    let hashStr = Math.abs(hash).toString(16);
    // Repetir y truncar para llegar a 64 caracteres
    while (hashStr.length < 64) {
        hashStr += hashStr;
    }
    return hashStr.substring(0, 64);
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
