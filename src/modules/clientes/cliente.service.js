const db = require('../../utils/db');

const CLIENT_COLUMNS = `
  id,
  nombre_completo,
  telefono,
  email,
  dui,
  nit,
  nrc,
  direccion,
  activo,
  fecha_creacion
`;

const getAllClientes = async () => {
  const result = await db.query(`SELECT ${CLIENT_COLUMNS} FROM clientes ORDER BY id DESC`);
  return result.rows;
};

const getClienteById = async (id) => {
  const result = await db.query(`SELECT ${CLIENT_COLUMNS} FROM clientes WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createCliente = async (data = {}) => {
  const result = await db.query(
    `INSERT INTO clientes (
      nombre_completo,
      telefono,
      email,
      dui,
      nit,
      nrc,
      direccion,
      activo
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING ${CLIENT_COLUMNS}`,
    [
      data.nombre_completo,
      data.telefono ?? null,
      data.email ?? null,
      data.dui ?? null,
      data.nit ?? null,
      data.nrc ?? null,
      data.direccion ?? null,
      data.activo ?? true
    ]
  );

  return result.rows[0];
};

const updateCliente = async (id, data = {}) => {
  const result = await db.query(
    `UPDATE clientes SET
      nombre_completo = $1,
      telefono = $2,
      email = $3,
      dui = $4,
      nit = $5,
      nrc = $6,
      direccion = $7,
      activo = $8
    WHERE id = $9
    RETURNING ${CLIENT_COLUMNS}`,
    [
      data.nombre_completo,
      data.telefono ?? null,
      data.email ?? null,
      data.dui ?? null,
      data.nit ?? null,
      data.nrc ?? null,
      data.direccion ?? null,
      data.activo ?? true,
      id
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const partialUpdateCliente = async (id, data = {}) => {
  const allowedFields = [
    'nombre_completo',
    'telefono',
    'email',
    'dui',
    'nit',
    'nrc',
    'direccion',
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
    `UPDATE clientes SET ${setClause} WHERE id = $${values.length} RETURNING ${CLIENT_COLUMNS}`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteCliente = async (id) => {
  const result = await db.query(
    `UPDATE clientes SET activo = false WHERE id = $1 RETURNING ${CLIENT_COLUMNS}`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Cliente desactivado' };
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  partialUpdateCliente,
  deleteCliente
};