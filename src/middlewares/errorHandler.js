/**
 * MANEJO GLOBAL DE ERRORES - errorHandler.js
 * ==========================================
 * Captura TODOS los errores que ocurran en la aplicación.
 * Si un error no se maneja, este middleware lo atrapa.
 * 
 * FLUJO:
 * 1. Cualquier error que se lance con next(error) llega aquí
 * 2. Registra el error en consola para debugging
 * 3. Devuelve una respuesta JSON al cliente con status HTTP y mensaje
 * 
 * DONDE SE USA:
 * - index.js: app.use(errorHandler) al final
 * - controllers: cada try/catch hace next(err) para errores
 * 
 * PARÁMETROS PRINCIPALES:
 * - err: el objeto error que se lanzó
 * - err.status: código HTTP personalizado (ej: 404, 400, 500)
 * - err.message: mensaje de error a mostrar
 * 
 * EJEMPLOS DE ERRORES QUE CAPTURA:
 * - Usuario no encontrado (404)
 * - Email inválido (400)
 * - Contraseña incorrecta
 * - Conexión a BD fallida (500)
 * - Errores no manejados (500 por defecto)
 * 
 * QUÉ PASA SIN ESTO:
 * - Los errores matarían la aplicación
 * - El cliente no sabría qué salió mal
 * - Experiencia de usuario terrible
 */

const errorHandler = (err, req, res, next) => {
  // Registra el error en la consola para que los desarrolladores lo vean
  console.error(err);

  // Responde al cliente con:
  // - status: código HTTP (err.status) o 500 si no hay
  // - message: mensaje de error (err.message) o genérico si no hay
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
