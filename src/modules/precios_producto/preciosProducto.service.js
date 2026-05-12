const db = require('../../utils/db');

const PRECIO_PRODUCTO_COLUMNS = `
  id,
  producto_id,
  tipo_precio_id,
  precio,
  activo,
  fecha_vigencia
`;

const getAllPreciosProducto = async () => {
  const result = await db.query(
    `SELECT ${PRECIO_PRODUCTO_COLUMNS} FROM precios_producto ORDER BY id DESC`
  );
  return result.rows;
};

const getPrecioProductoById = async (id) => {
  const result = await db.query(
    `SELECT ${PRECIO_PRODUCTO_COLUMNS} FROM precios_producto WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Precio de producto no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createPrecioProducto = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO precios_producto (
      producto_id,
      tipo_precio_id,
      precio,
      activo,
      fecha_vigencia
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING ${PRECIO_PRODUCTO_COLUMNS}`,
    [
      data.producto_id,
      data.tipo_precio_id,
      data.precio,
      data.activo ?? true,
      data.fecha_vigencia ?? new Date()
    ]
  );

  return result.rows[0];
};

const updatePrecioProducto = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE precios_producto
     SET producto_id = $1,
         tipo_precio_id = $2,
         precio = $3,
         activo = $4,
         fecha_vigencia = $5
     WHERE id = $6
     RETURNING ${PRECIO_PRODUCTO_COLUMNS}`,
    [
      data.producto_id,
      data.tipo_precio_id,
      data.precio,
      data.activo ?? true,
      data.fecha_vigencia ?? new Date(),
      id
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Precio de producto no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdatePrecioProducto = async (id, data = {}) => {
  const allowedFields = ['producto_id', 'tipo_precio_id', 'precio', 'activo', 'fecha_vigencia'];
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
    `UPDATE precios_producto SET ${setClause} WHERE id = $${values.length} RETURNING ${PRECIO_PRODUCTO_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Precio de producto no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deletePrecioProducto = async (id) => {
  const result = await db.query(
    `UPDATE precios_producto SET activo = false WHERE id = $1 RETURNING ${PRECIO_PRODUCTO_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Precio de producto no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Precio de producto desactivado' };
};

module.exports = {
  getAllPreciosProducto,
  getPrecioProductoById,
  createPrecioProducto,
  updatePrecioProducto,
  partialUpdatePrecioProducto,
  deletePrecioProducto
};