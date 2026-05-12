const db = require('../../utils/db');

const MATERIAL_COLUMNS = `
  id,
  nombre,
  descripcion,
  activo
`;

const getAllMateriales = async () => {
  const result = await db.query(
    `SELECT ${MATERIAL_COLUMNS} FROM materiales ORDER BY id DESC`
  );
  return result.rows;
};

const getMaterialById = async (id) => {
  const result = await db.query(
    `SELECT ${MATERIAL_COLUMNS} FROM materiales WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Material no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createMaterial = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO materiales (nombre, descripcion, activo)
     VALUES ($1, $2, $3)
     RETURNING ${MATERIAL_COLUMNS}`,
    [data.nombre, data.descripcion ?? null, data.activo ?? true]
  );

  return result.rows[0];
};

const updateMaterial = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE materiales
     SET nombre = $1,
         descripcion = $2,
         activo = $3
     WHERE id = $4
     RETURNING ${MATERIAL_COLUMNS}`,
    [data.nombre, data.descripcion ?? null, data.activo ?? true, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Material no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateMaterial = async (id, data = {}) => {
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
    `UPDATE materiales SET ${setClause} WHERE id = $${values.length} RETURNING ${MATERIAL_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Material no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteMaterial = async (id) => {
  const result = await db.query(
    `UPDATE materiales SET activo = false WHERE id = $1 RETURNING ${MATERIAL_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Material no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Material desactivado' };
};

module.exports = {
  getAllMateriales,
  getMaterialById,
  createMaterial,
  updateMaterial,
  partialUpdateMaterial,
  deleteMaterial
};module.exports = {};
