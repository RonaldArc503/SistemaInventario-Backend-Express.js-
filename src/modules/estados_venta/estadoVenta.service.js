const db = require('../../utils/db');

const ESTADO_VENTA_COLUMNS = `
  id,
  nombre
`;

const getAllEstadosVenta = async () => {
  const result = await db.query(
    `SELECT ${ESTADO_VENTA_COLUMNS} FROM estados_venta ORDER BY id DESC`
  );
  return result.rows;
};

const getEstadoVentaById = async (id) => {
  const result = await db.query(
    `SELECT ${ESTADO_VENTA_COLUMNS} FROM estados_venta WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Estado de venta no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createEstadoVenta = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO estados_venta (nombre)
     VALUES ($1)
     RETURNING ${ESTADO_VENTA_COLUMNS}`,
    [data.nombre]
  );

  return result.rows[0];
};

const updateEstadoVenta = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE estados_venta
     SET nombre = $1
     WHERE id = $2
     RETURNING ${ESTADO_VENTA_COLUMNS}`,
    [data.nombre, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Estado de venta no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateEstadoVenta = async (id, data = {}) => {
  const allowedFields = ['nombre'];
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
    `UPDATE estados_venta SET ${setClause} WHERE id = $${values.length} RETURNING ${ESTADO_VENTA_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Estado de venta no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteEstadoVenta = async (id) => {
  const result = await db.query(
    `DELETE FROM estados_venta WHERE id = $1 RETURNING ${ESTADO_VENTA_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Estado de venta no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Estado de venta eliminado' };
};

module.exports = {
  getAllEstadosVenta,
  getEstadoVentaById,
  createEstadoVenta,
  updateEstadoVenta,
  partialUpdateEstadoVenta,
  deleteEstadoVenta
};