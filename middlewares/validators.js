/**
 * VALIDACIÓN DE DATOS - validators.js
 * ===================================
 * Valida que los datos enviados en las peticiones cumplan reglas específicas.
 * Usa la librería express-validator.
 * 
 * FLUJO:
 * 1. validateUser: define reglas de validación (nombre, email, password)
 * 2. runValidations: ejecuta las validaciones y retorna errores si los hay
 * 3. Si hay errores, devuelve 400 (Bad Request) con lista de errores
 * 4. Si todo es válido, continúa al siguiente middleware
 * 
 * DEPENDENCIAS:
 * - routes/users.js: usa estos validadores en el endpoint POST
 * 
 * REGLAS APLICADAS:
 * - name: no puede estar vacío
 * - email: debe ser un email válido (formato correcto)
 * - password: mínimo 6 caracteres
 * 
 * QUÉ PASA SI NO SE VALIDA:
 * - Datos inválidos podrían guardarse en la BD
 * - Ej: email sin @, password vacía, usuario sin nombre
 * - Datos corruptos crean problemas más adelante
 * 
 * SIN ESTO: cualquiera podría crear usuarios con datos basura
 */

const { body, validationResult } = require('express-validator');

// Reglas de validación para crear/actualizar un usuario
const validateUser = [
  // Valida que 'nombre' no esté vacío
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  
  // Valida que 'email' sea un email válido
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  
  // Valida que 'contrasenia' tenga al menos 6 caracteres
  body('contrasenia')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

/**
 * Middleware ejecutor de validaciones
 * - Obtiene los errores de validación
 * - Si hay errores, retorna 400 con detalles
 * - Si no hay errores, continúa al siguiente middleware
 */
const runValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Retorna errores de validación al cliente
    return res.status(400).json({
      errors: errors.array()
    });
  }

  // Si no hay errores, continúa al controlador
  next();
};

module.exports = {
  validateUser,
  runValidations
};
