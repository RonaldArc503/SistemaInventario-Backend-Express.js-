/**
 * RUTAS DEL API - routes/users.js
 * ==============================
 * Define todos los endpoints (rutas) del API de usuarios.
 * Conecta cada ruta HTTP con su controlador correspondiente.
 * 
 * FLUJO DE UNA PETICIÓN:
 * 1. Cliente hace petición (GET /users/1)
 * 2. Express busca la ruta coincidente (router.get('/:id', ...))
 * 3. Si hay middlewares, los ejecuta primero (validadores)
 * 4. Luego ejecuta el controlador correspondient * 5. El controlador procesa y responde
 * 
 * DEPENDENCIAS:
 * - Importa usersController: funciones que procesan las peticiones
 * - Importa validadores: verifican datos antes de procesar
 * 
 * QUIEN DEPENDE DE ESTO:
 * - index.js: app.use('/users', usersRoutes) - usa estas rutas
 * - clients: hacen peticiones HTTP a estos endpoints
 * 
 * PARÁMETROS EN RUTAS:
 * - :id = ID del usuario en la URL (ej: /users/5)
 * - :email = Email del usuario (ej: /users/email/juan@mail.com)
 * - ?email=... = Parámetro query (ej: /users/check/email?email=juan@mail.com)
 * 
 * SIN ESTO:
 * - No habría endpoints
 * - El cliente no sabría a dónde enviar peticiones
 * - No se podría hacer CRUD
 */

const express = require('express');
const router = express.Router();

const usersController = require('../usuarios/usuario.controller');
const { validateUser, runValidations } = require('../../middlewares/validators');

// =================== RUTAS GET ===================

// GET /users
// Obtiene TODOS los usuarios
router.get('/', usersController.getAllUsers);

// GET /users/:id
// Obtiene un usuario por su ID`
router.get('/:id', usersController.getUserById);

// GET /users/email/:email
// Obtiene un usuario por su email
router.get('/email/:email', usersController.getUserByEmail);

// GET /users/check/email?email=...
// Verifica si un email ya existe en la BD (útil antes de registrar)
router.get('/check/email', usersController.checkEmailExists);

// =================== RUTA POST ===================

// POST /users
// Crea un nuevo usuario
// FLUJO:
//   1. validateUser: valida que name, email y password cumplan reglas
//   2. runValidations: si hay errores de validación, detiene y responde 400
//   3. usersController.createUser: si todo es válido, crea el usuario
router.post(
  '/',
  validateUser,         // Reglas de validación
  runValidations,       // Ejecuta validaciones
  usersController.createUser // Si pasa validación, crea usuario
);

// =================== RUTAS PUT/PATCH ===================

// PUT /users/:id
// Actualiza TODOS los campos de un usuario
// Nota: requiere ALL los campos en el body
router.put('/:id', usersController.updateUser);

// PATCH /users/:id
// Actualiza SOLO los campos que se envíen
// Nota: puedes enviar solo name, o solo email, o ambos
router.patch('/:id', usersController.partialUpdateUser);

// =================== RUTA DELETE ===================

// DELETE /users/:id
// Elimina un usuario de la BD
router.delete('/:id', usersController.deleteUser);

module.exports = router;
