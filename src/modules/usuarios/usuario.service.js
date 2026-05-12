const db = require('../../utils/db');
const bcrypt = require('bcryptjs');

const PUBLIC_USER_COLUMNS = `
  id,
  nombre_usuario,
  nombre_completo,
  rol_id,
  activo,
  fecha_creacion,
  ultimo_acceso
`;

const buildUserUpdates = async (data = {}, { includePassword = false } = {}) => {
  const updates = {};

  if (data.nombre_usuario !== undefined || data.email !== undefined) {
    updates.nombre_usuario = data.nombre_usuario ?? data.email;
  }

  if (data.nombre_completo !== undefined || data.nombre !== undefined) {
    updates.nombre_completo = data.nombre_completo ?? data.nombre;
  }

  if (data.rol_id !== undefined) {
    updates.rol_id = data.rol_id;
  }

  if (data.activo !== undefined) {
    updates.activo = data.activo;
  }

  if (includePassword && (data.contrasenia !== undefined || data.password !== undefined)) {
    const contrasenia = data.contrasenia ?? data.password;
    updates.contrasena_hash = await bcrypt.hash(contrasenia, 10);
  }

  return updates;
};

const getAllUsers = async () => {
  const result = await db.query(`SELECT ${PUBLIC_USER_COLUMNS} FROM usuarios ORDER BY id DESC`);
  return result.rows;
};

const getUserById = async (id) => {
  const result = await db.query(`SELECT ${PUBLIC_USER_COLUMNS} FROM usuarios WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createUser = async (data = {}) => {
  const nombreUsuario = data.nombre_usuario ?? data.email;
  const nombreCompleto = data.nombre_completo ?? data.nombre;
  const contrasenia = data.contrasenia ?? data.password;
  const rolId = data.rol_id ?? 2;

  if (!nombreUsuario || !nombreCompleto || !contrasenia) {
    const error = new Error('Faltan campos obligatorios para crear el usuario');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(contrasenia, 10);

  const result = await db.query(
    `INSERT INTO usuarios (
      nombre_usuario,
      contrasena_hash,
      nombre_completo,
      rol_id,
      activo
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING ${PUBLIC_USER_COLUMNS}`,
    [nombreUsuario, hashedPassword, nombreCompleto, rolId, data.activo ?? true]
  );

  return result.rows[0];
};

const updateUser = async (id, data = {}) => {
  const updates = await buildUserUpdates(data, { includePassword: true });

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
    `UPDATE usuarios SET ${setClause} WHERE id = $${values.length} RETURNING ${PUBLIC_USER_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await db.query(
    `UPDATE usuarios SET activo = false WHERE id = $1 RETURNING ${PUBLIC_USER_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Usuario desactivado' };
};

const partialUpdateUser = async (id, data = {}) => {
  const updates = await buildUserUpdates(data, { includePassword: true });

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
    `UPDATE usuarios SET ${setClause} WHERE id = $${values.length} RETURNING ${PUBLIC_USER_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT ${PUBLIC_USER_COLUMNS} FROM usuarios WHERE nombre_usuario = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const checkEmailExists = async (email) => {
  const result = await db.query('SELECT id FROM usuarios WHERE nombre_usuario = $1', [email]);
  return result.rows.length > 0;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  partialUpdateUser,
  getUserByEmail,
  checkEmailExists
};