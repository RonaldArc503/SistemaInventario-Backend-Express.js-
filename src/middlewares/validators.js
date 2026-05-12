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
 * - nombre_usuario: obligatorio
 * - nombre_completo: obligatorio
 * - contrasenia: mínimo 6 caracteres
 * - rol_id: entero positivo
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
  body('nombre_usuario').custom((value, { req }) => {
    const nombreUsuario = value ?? req.body.email;

    if (!nombreUsuario || !String(nombreUsuario).trim()) {
      throw new Error('El nombre de usuario es obligatorio');
    }

    return true;
  }),
  body('nombre_completo').custom((value, { req }) => {
    const nombreCompleto = value ?? req.body.nombre;

    if (!nombreCompleto || !String(nombreCompleto).trim()) {
      throw new Error('El nombre completo es obligatorio');
    }

    return true;
  }),
  body('contrasenia').custom((value, { req }) => {
    const contrasenia = value ?? req.body.password;

    if (!contrasenia || String(contrasenia).length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return true;
  }),
  body('rol_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('El rol debe ser un entero válido')
];

// Reglas de validación para clientes
const validateCliente = [
  body('nombre_completo')
    .notEmpty()
    .withMessage('El nombre completo es obligatorio'),
  body('telefono')
    .optional({ nullable: true })
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede superar 20 caracteres'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Email inválido'),
  body('dui')
    .optional({ nullable: true })
    .isLength({ max: 20 })
    .withMessage('El DUI no puede superar 20 caracteres'),
  body('nit')
    .optional({ nullable: true })
    .isLength({ max: 20 })
    .withMessage('El NIT no puede superar 20 caracteres'),
  body('nrc')
    .optional({ nullable: true })
    .isLength({ max: 20 })
    .withMessage('El NRC no puede superar 20 caracteres'),
  body('direccion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La dirección debe ser texto'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para tipos de producto
const validateTipoProducto = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La descripción debe ser texto'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para materiales
const validateMaterial = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La descripción debe ser texto'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para roles
const validateRole = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para tipos de precio
const validateTipoPrecio = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La descripción debe ser texto'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para productos
const validateProducto = [
  body('sku')
    .notEmpty()
    .withMessage('El SKU es obligatorio'),
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('tipo_id')
    .isInt({ min: 1 })
    .withMessage('El tipo de producto debe ser un entero válido'),
  body('material_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('El material debe ser un entero válido'),
  body('sexo')
    .optional({ nullable: true })
    .isIn(['M', 'F', 'U'])
    .withMessage('El sexo debe ser M, F o U'),
  body('precio_costo')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El precio de costo debe ser mayor o igual a 0'),
  body('stock_actual')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('El stock actual debe ser un entero mayor o igual a 0'),
  body('stock_minimo_alerta')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('El stock mínimo de alerta debe ser un entero mayor o igual a 0'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La descripción debe ser texto'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para precios de producto
const validatePrecioProducto = [
  body('producto_id')
    .isInt({ min: 1 })
    .withMessage('El producto debe ser un entero válido'),
  body('tipo_precio_id')
    .isInt({ min: 1 })
    .withMessage('El tipo de precio debe ser un entero válido'),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser mayor o igual a 0'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean(),
  body('fecha_vigencia')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('La fecha de vigencia debe ser una fecha válida')
];

// Reglas de validación para métodos de pago
const validateMetodoPago = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('activo')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
    .toBoolean()
];

// Reglas de validación para estados de venta
const validateEstadoVenta = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
];

// Reglas de validación para ventas
const validateVenta = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario debe ser un entero válido'),
  body('cliente_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('El cliente debe ser un entero válido'),
  body('metodo_pago_id')
    .isInt({ min: 1 })
    .withMessage('El método de pago debe ser un entero válido'),
  body('estado_id')
    .isInt({ min: 1 })
    .withMessage('El estado de venta debe ser un entero válido'),
  body('numero_factura')
    .optional({ nullable: true })
    .isString()
    .withMessage('El número de factura debe ser texto'),
  body('subtotal')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El subtotal debe ser mayor o igual a 0'),
  body('descuento')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El descuento debe ser mayor o igual a 0'),
  body('impuesto')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El impuesto debe ser mayor o igual a 0'),
  body('monto_total')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El monto total debe ser mayor o igual a 0'),
  body('notas')
    .optional({ nullable: true })
    .isString()
    .withMessage('Las notas deben ser texto')
];

// Reglas de validación para anulación de venta
const validateAnularVenta = [
  body('motivo_anulacion')
    .notEmpty()
    .withMessage('El motivo de anulación es obligatorio'),
  body('anulado_por_usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario que anula debe ser un entero válido')
];

// Reglas de validación para detalle de ventas
const validateDetalleVenta = [
  body('venta_id')
    .isInt({ min: 1 })
    .withMessage('La venta debe ser un entero válido'),
  body('producto_id')
    .isInt({ min: 1 })
    .withMessage('El producto debe ser un entero válido'),
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero mayor a 0'),
  body('precio_unitario_momento')
    .isFloat({ min: 0 })
    .withMessage('El precio unitario debe ser mayor o igual a 0'),
  body('descuento_linea')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El descuento de línea debe ser mayor o igual a 0')
];

// Reglas de validación para tipos de movimiento de stock
const validateTipoMovimientoStock = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
];

// Reglas de validación para movimientos de stock
const validateMovimientoStock = [
  body('producto_id')
    .isInt({ min: 1 })
    .withMessage('El producto debe ser un entero válido'),
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario debe ser un entero válido'),
  body('tipo_movimiento_id')
    .isInt({ min: 1 })
    .withMessage('El tipo de movimiento debe ser un entero válido'),
  body('cantidad_cambio')
    .isInt()
    .custom((value) => Number(value) !== 0)
    .withMessage('La cantidad de cambio no puede ser cero'),
  body('venta_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('La venta debe ser un entero válido'),
  body('notas')
    .optional({ nullable: true })
    .isString()
    .withMessage('Las notas deben ser texto')
];

// Reglas de validación para cortes de caja
const validateCorteCaja = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario debe ser un entero válido'),
  body('fecha_corte')
    .optional({ nullable: true })
    .isISO8601({ strict: true })
    .withMessage('La fecha de corte debe ser una fecha válida'),
  body('hora_apertura')
    .isISO8601()
    .withMessage('La hora de apertura debe ser una fecha y hora válida'),
  body('hora_cierre')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('La hora de cierre debe ser una fecha y hora válida'),
  body('efectivo_inicial')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El efectivo inicial debe ser mayor o igual a 0'),
  body('esperado_efectivo')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El esperado en efectivo debe ser mayor o igual a 0'),
  body('esperado_transferencia')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El esperado en transferencia debe ser mayor o igual a 0'),
  body('esperado_qr')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El esperado en QR debe ser mayor o igual a 0'),
  body('declarado_efectivo')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El declarado en efectivo debe ser mayor o igual a 0'),
  body('declarado_transferencia')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El declarado en transferencia debe ser mayor o igual a 0'),
  body('declarado_qr')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('El declarado en QR debe ser mayor o igual a 0'),
  body('notas')
    .optional({ nullable: true })
    .isString()
    .withMessage('Las notas deben ser texto')
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
  validateCliente,
  validateTipoProducto,
  validateMaterial,
  validateRole,
  validateTipoPrecio,
  validateProducto,
  validatePrecioProducto,
  validateMetodoPago,
  validateEstadoVenta,
  validateVenta,
  validateAnularVenta,
  validateDetalleVenta,
  validateTipoMovimientoStock,
  validateMovimientoStock,
  validateCorteCaja,
  runValidations
};
