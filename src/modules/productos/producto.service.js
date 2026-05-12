const db = require('../../utils/db');

const PRODUCT_COLUMNS = `
  id,
  sku,
  codigo_barras,
  nombre,
  descripcion,
  tipo_id,
  material_id,
  sexo,
  precio_costo,
  stock_actual,
  stock_minimo_alerta,
  activo,
  fecha_creacion,
  fecha_actualizacion
`;

const getAllProductos = async () => {
  const result = await db.query(
    `SELECT ${PRODUCT_COLUMNS} FROM productos ORDER BY id DESC`
  );
  return result.rows;
};

const getProductoById = async (id) => {
  const result = await db.query(
    `SELECT ${PRODUCT_COLUMNS} FROM productos WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createProducto = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO productos (
      sku,
      codigo_barras,
      nombre,
      descripcion,
      tipo_id,
      material_id,
      sexo,
      precio_costo,
      stock_actual,
      stock_minimo_alerta,
      activo
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING ${PRODUCT_COLUMNS}`,
    [
      data.sku,
      data.codigo_barras ?? null,
      data.nombre,
      data.descripcion ?? null,
      data.tipo_id,
      data.material_id ?? null,
      data.sexo ?? 'U',
      data.precio_costo ?? 0,
      data.stock_actual ?? 0,
      data.stock_minimo_alerta ?? 0,
      data.activo ?? true
    ]
  );

  return result.rows[0];
};

const updateProducto = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE productos SET
      sku = $1,
      codigo_barras = $2,
      nombre = $3,
      descripcion = $4,
      tipo_id = $5,
      material_id = $6,
      sexo = $7,
      precio_costo = $8,
      stock_actual = $9,
      stock_minimo_alerta = $10,
      activo = $11,
      fecha_actualizacion = now()
    WHERE id = $12
    RETURNING ${PRODUCT_COLUMNS}`,
    [
      data.sku,
      data.codigo_barras ?? null,
      data.nombre,
      data.descripcion ?? null,
      data.tipo_id,
      data.material_id ?? null,
      data.sexo ?? 'U',
      data.precio_costo ?? 0,
      data.stock_actual ?? 0,
      data.stock_minimo_alerta ?? 0,
      data.activo ?? true,
      id
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateProducto = async (id, data = {}) => {
  const allowedFields = [
    'sku',
    'codigo_barras',
    'nombre',
    'descripcion',
    'tipo_id',
    'material_id',
    'sexo',
    'precio_costo',
    'stock_actual',
    'stock_minimo_alerta',
    'activo'
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
    `UPDATE productos SET ${setClause}, fecha_actualizacion = now() WHERE id = $${values.length} RETURNING ${PRODUCT_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteProducto = async (id) => {
  const result = await db.query(
    `UPDATE productos SET activo = false, fecha_actualizacion = now() WHERE id = $1 RETURNING ${PRODUCT_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Producto desactivado' };
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  partialUpdateProducto,
  deleteProducto
};