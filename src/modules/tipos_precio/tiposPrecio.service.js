const db = require('../../utils/db');

const TIPO_PRECIO_COLUMNS = `
  id,
  nombre,
  descripcion,
  activo
`;

const getAllTiposPrecio = async () => {
  const result = await db.query(
    `SELECT ${TIPO_PRECIO_COLUMNS} FROM tipos_precio ORDER BY id DESC`
  );
  return result.rows;
};

const getTipoPrecioById = async (id) => {
  const result = await db.query(
    `SELECT ${TIPO_PRECIO_COLUMNS} FROM tipos_precio WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Tipo de precio no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createTipoPrecio = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO tipos_precio (nombre, descripcion, activo)
     VALUES ($1, $2, $3)
     RETURNING ${TIPO_PRECIO_COLUMNS}`,
    [data.nombre, data.descripcion ?? null, data.activo ?? true]
  );

  return result.rows[0];
};

const updateTipoPrecio = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE tipos_precio
     SET nombre = $1,
         descripcion = $2,
         activo = $3
     WHERE id = $4
     RETURNING ${TIPO_PRECIO_COLUMNS}`,
    [data.nombre, data.descripcion ?? null, data.activo ?? true, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Tipo de precio no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateTipoPrecio = async (id, data = {}) => {
  const allowedFields = ['nombre', 'descripcion', 'activo'];
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
    `UPDATE tipos_precio SET ${setClause} WHERE id = $${values.length} RETURNING ${TIPO_PRECIO_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Tipo de precio no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteTipoPrecio = async (id) => {
  const result = await db.query(
    `UPDATE tipos_precio SET activo = false WHERE id = $1 RETURNING ${TIPO_PRECIO_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Tipo de precio no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Tipo de precio desactivado' };
};

module.exports = {
  getAllTiposPrecio,
  getTipoPrecioById,
  createTipoPrecio,
  updateTipoPrecio,
  partialUpdateTipoPrecio,
  deleteTipoPrecio
};