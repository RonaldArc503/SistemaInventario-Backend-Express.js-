/**
 * SERVICIOS DE USUARIOS - services/usersService.js
 * ================================================
 * Este archivo contiene toda la LOGICA DE NEGOCIO del API de usuarios.
 * 
 * QUE SON LOS SERVICIOS?
 * - Capa intermedia entre controladores y base de datos
 * - Contienen la lógica que manipula datos
 * - No saben de peticiones/respuestas HTTP (solo lógica)
 * - Interactúan directamente con la BD
 * 
 * FLUJO GENERAL:
 * Ruta -> Controlador -> Servicio -> BD
 */

const db = require('../utils/db');
const bcrypt = require('bcryptjs');

/**
 * Obtiene TODOS los usuarios de la BD
 * SQL: SELECT * FROM usuarios
 * Retorna: array de usuarios
 */
const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM usuarios');
  return result.rows;
};

/**
 * Obtiene UN usuario por ID
 * PARAMETROS: id del usuario
 * SQL: SELECT * FROM usuarios WHERE id_usuario = $1
 * Nota: $1 es parametrizacion (seguro contra SQL injection)
 * Si no existe: lanza error 404
 */
const getUserById = async (id) => {
  const result = await db.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * Crea UN nuevo usuario
 * PARAMETROS: { nombre, email, contrasenia }
 * SEGURIDAD: Encripta contrasenia con bcrypt antes de guardar
 *           NUNCA guardar passwords en texto plano
 * SQL: INSERT INTO usuarios(nombre, email, contrasenia, activo) VALUES($1,$2,$3,$4) RETURNING *
 * Retorna: usuario creado con ID auto-generado
 * SIN ENCRIPTACION: Catastrofe de seguridad si roban la BD
 */
const createUser = async ({ nombre, email, contrasenia }) => {
  const hashedPassword = await bcrypt.hash(contrasenia, 10);

  const result = await db.query(
    'INSERT INTO usuarios(nombre, email, contrasenia, activo) VALUES($1,$2,$3,$4) RETURNING *',
    [nombre, email, hashedPassword, 'A']
  );

  return result.rows[0];
};

/**
 * Actualiza TODOS los campos de UN usuario
 * PARAMETROS: id, { nombre, email }
 * Nota: NO actualiza contrasenia aqui (ver partialUpdateUser)
 * SQL: UPDATE usuarios SET nombre=$1, email=$2 WHERE id_usuario=$3 RETURNING *
 * Retorna: usuario con datos actualizados
 * SIN ESTO: Los datos no se pueden cambiar, usuarios atrapados con info incorrecta
 */
const updateUser = async (id, data) => {
  const result = await db.query(
    'UPDATE usuarios SET nombre=$1, email=$2 WHERE id_usuario=$3 RETURNING *',
    [data.nombre, data.email, id]
  );

  return result.rows[0];
};

/**
 * Elimina UN usuario de la BD - OPERACION IRREVERSIBLE
 * PARAMETROS: id
 * CUIDADO: Esta operacion NO SE PUEDE DESHACER
 * El usuario se elimina PERMANENTEMENTE
 * SQL: DELETE FROM usuarios WHERE id_usuario=$1 RETURNING *
 * Si no existe: lanza error 404
 * SIN ESTO: Los usuarios no se pueden eliminar, BD se llena de datos viejos
 */
const deleteUser = async (id) => {
  const result = await db.query(
    'DELETE FROM usuarios WHERE id_usuario=$1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Usuario eliminado' };
};

/**
 * Actualiza SOLO los campos enviados (actualización parcial - PATCH)
 * PARAMETROS: id, data
 * Ejemplos data:
 *   - { nombre: "Juan" } - solo actualiza nombre
 *   - { email: "nuevo@mail.com" } - solo email
 *   - { nombre: "Juan", contrasenia: "new123" } - nombre y contrasenia
 * 
 * FLUJO:
 * 1. Filtra solo campos permitidos (nombre, email, contrasenia)
 * 2. Si contrasenia viene, la encripta
 * 3. Construye dinámicamente SQL UPDATE
 * 4. Parametrización automática = seguro contra SQL injection
 * 
 * SIN ESTO: No se pueden hacer actualizaciones parciales
 */
const partialUpdateUser = async (id, data) => {
  const allowedFields = ['nombre', 'email', 'contrasenia'];
  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'contrasenia') {
        updates[field] = await bcrypt.hash(data[field], 10);
      } else {
        updates[field] = data[field];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error('No hay campos para actualizar');
    error.status = 400;
    throw error;
  }

  const setClause = Object.keys(updates)
    .map((key, index) => `${key}=$${index + 1}`)
    .join(', ');
  const values = [...Object.values(updates), id];

  const result = await db.query(
    `UPDATE usuarios SET ${setClause} WHERE id_usuario=$${values.length} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * Busca UN usuario por EMAIL
 * PARAMETROS: email
 * CASOS DE USO: Login, recuperacion de contraseña, validaciones
 * SQL: SELECT * FROM usuarios WHERE email = $1
 * Si no existe: lanza error 404
 * NOTA: En produccion, email deberia ser UNIQUE en la BD
 * SIN ESTO: No se puede buscar por email, login imposible
 */
const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [
    email
  ]);

  if (result.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * Verifica SI UN EMAIL YA EXISTE (sin lanzar error)
 * PARAMETROS: email
 * RETORNA: true (existe) o false (disponible)
 * CASOS DE USO: Validacion en registro, verificar duplicados
 * SQL: SELECT id_usuario FROM usuarios WHERE email = $1
 * DIFERENCIA CON getUserByEmail:
 *   - getUserByEmail: lanza error 404 si no encuentra
 *   - checkEmailExists: devuelve true/false, sin error
 * SIN ESTO: No se puede validar disponibilidad, usuarios duplicados
 */
const checkEmailExists = async (email) => {
  const result = await db.query('SELECT id_usuario FROM usuarios WHERE email = $1', [
    email
  ]);
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
