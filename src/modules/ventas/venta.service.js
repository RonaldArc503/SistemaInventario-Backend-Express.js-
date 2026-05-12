const db = require('../../utils/db');

const VENTA_COLUMNS = `
  id,
  usuario_id,
  cliente_id,
  metodo_pago_id,
  estado_id,
  numero_factura,
  fecha_venta,
  subtotal,
  descuento,
  impuesto,
  monto_total,
  notas,
  motivo_anulacion,
  fecha_anulacion,
  anulado_por_usuario_id
`;

const getAllVentas = async () => {
  const result = await db.query(`SELECT ${VENTA_COLUMNS} FROM ventas ORDER BY id DESC`);
  return result.rows;
};

const getVentaById = async (id) => {
  const result = await db.query(`SELECT ${VENTA_COLUMNS} FROM ventas WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    const error = new Error('Venta no encontrada');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createVenta = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO ventas (
      usuario_id,
      cliente_id,
      metodo_pago_id,
      estado_id,
      numero_factura,
      subtotal,
      descuento,
      impuesto,
      monto_total,
      notas
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING ${VENTA_COLUMNS}`,
    [
      data.usuario_id,
      data.cliente_id ?? null,
      data.metodo_pago_id,
      data.estado_id,
      data.numero_factura ?? null,
      data.subtotal ?? 0,
      data.descuento ?? 0,
      data.impuesto ?? 0,
      data.monto_total ?? 0,
      data.notas ?? null
    ]
  );

  return result.rows[0];
};

const updateVenta = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE ventas
     SET usuario_id = $1,
         cliente_id = $2,
         metodo_pago_id = $3,
         estado_id = $4,
         numero_factura = $5,
         subtotal = $6,
         descuento = $7,
         impuesto = $8,
         monto_total = $9,
         notas = $10
     WHERE id = $11
     RETURNING ${VENTA_COLUMNS}`,
    [
      data.usuario_id,
      data.cliente_id ?? null,
      data.metodo_pago_id,
      data.estado_id,
      data.numero_factura ?? null,
      data.subtotal ?? 0,
      data.descuento ?? 0,
      data.impuesto ?? 0,
      data.monto_total ?? 0,
      data.notas ?? null,
      id
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Venta no encontrada');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateVenta = async (id, data = {}) => {
  const allowedFields = [
    'usuario_id',
    'cliente_id',
    'metodo_pago_id',
    'estado_id',
    'numero_factura',
    'subtotal',
    'descuento',
    'impuesto',
    'monto_total',
    'notas'
  ];
  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error('No hay campos para actualizar');
    error.status = 400;
    throw error;
  }

  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  const values = [...Object.values(updates), id];

  const result = await db.query(
    `UPDATE ventas SET ${setClause} WHERE id = $${values.length} RETURNING ${VENTA_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Venta no encontrada');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const annulVenta = async (id, data = {}) => {
  const estadoAnuladaResult = await db.query(
    'SELECT id FROM estados_venta WHERE nombre = $1 LIMIT 1',
    ['anulada']
  );

  if (estadoAnuladaResult.rows.length === 0) {
    const error = new Error('No existe el estado anulada en la tabla estados_venta');
    error.status = 400;
    throw error;
  }

  const estadoAnuladaId = estadoAnuladaResult.rows[0].id;

  const result = await db.query(
    `UPDATE ventas
     SET estado_id = $1,
         motivo_anulacion = $2,
         fecha_anulacion = now(),
         anulado_por_usuario_id = $3
     WHERE id = $4
     RETURNING ${VENTA_COLUMNS}`,
    [estadoAnuladaId, data.motivo_anulacion, data.anulado_por_usuario_id, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Venta no encontrada');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteVenta = async (id, data = {}) => {
  return annulVenta(id, data);
};

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  partialUpdateVenta,
  deleteVenta,
  annulVenta
};module.exports = {};
