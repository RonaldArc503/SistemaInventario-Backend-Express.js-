const db = require('../../utils/db');

const ROLE_COLUMNS = `
  id,
  nombre,
  activo
`;

const getAllRoles = async () => {
  const result = await db.query(`SELECT ${ROLE_COLUMNS} FROM roles ORDER BY id DESC`);
  return result.rows;
};

const getRoleById = async (id) => {
  const result = await db.query(`SELECT ${ROLE_COLUMNS} FROM roles WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    const error = new Error('Rol no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createRole = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO roles (nombre, activo)
     VALUES ($1, $2)
     RETURNING ${ROLE_COLUMNS}`,
    [data.nombre, data.activo ?? true]
  );

  return result.rows[0];
};

const updateRole = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE roles
     SET nombre = $1,
         activo = $2
     WHERE id = $3
     RETURNING ${ROLE_COLUMNS}`,
    [data.nombre, data.activo ?? true, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Rol no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateRole = async (id, data = {}) => {
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
    `UPDATE roles SET ${setClause} WHERE id = $${values.length} RETURNING ${ROLE_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Rol no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteRole = async (id) => {
  const result = await db.query(
    `UPDATE roles SET activo = false WHERE id = $1 RETURNING ${ROLE_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Rol no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Rol desactivado' };
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  partialUpdateRole,
  deleteRole
};module.exports = {};
