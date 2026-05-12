const db = require('../../utils/db');

const METODO_PAGO_COLUMNS = `
  id,
  nombre,
  activo
`;

const getAllMetodosPago = async () => {
  const result = await db.query(`SELECT ${METODO_PAGO_COLUMNS} FROM metodos_pago ORDER BY id DESC`);
  return result.rows;
};

const getMetodoPagoById = async (id) => {
  const result = await db.query(`SELECT ${METODO_PAGO_COLUMNS} FROM metodos_pago WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    const error = new Error('Método de pago no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createMetodoPago = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO metodos_pago (nombre, activo)
     VALUES ($1, $2)
     RETURNING ${METODO_PAGO_COLUMNS}`,
    [data.nombre, data.activo ?? true]
  );

  return result.rows[0];
};

const updateMetodoPago = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE metodos_pago
     SET nombre = $1,
         activo = $2
     WHERE id = $3
     RETURNING ${METODO_PAGO_COLUMNS}`,
    [data.nombre, data.activo ?? true, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Método de pago no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateMetodoPago = async (id, data = {}) => {
  const allowedFields = ['nombre', 'activo'];
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
    `UPDATE metodos_pago SET ${setClause} WHERE id = $${values.length} RETURNING ${METODO_PAGO_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Método de pago no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteMetodoPago = async (id) => {
  const result = await db.query(
    `UPDATE metodos_pago SET activo = false WHERE id = $1 RETURNING ${METODO_PAGO_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Método de pago no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Método de pago desactivado' };
};

module.exports = {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  partialUpdateMetodoPago,
  deleteMetodoPago
};module.exports = {};
