/**
 * CONTROLADORES - controllers/usersController.js
 * =============================================
 * Los controladores son el "puente" entre rutas y servicios.
 * 
 * FLUJO GENERAL:
 * 1. Ruta recibe petición HTTP
 * 2. Controlador procesa la petición
 * 3. Controlador llama a un servicio para hacer el trabajo
 * 4. Controlador devuelve respuesta al cliente
 * 
 * RESPONSABILIDADES DEL CONTROLADOR:
 * - Obtener datos de la petición (req.body, req.params, req.query)
 * - Llamar al servicio correspondiente
 * - Capturar errores con try/catch
 * - Enviar respuesta al cliente (res.json(), res.status()...)
 * - Si hay error, pasar al siguiente middleware con next(err)
 * 
 * DIFERENCIA CON SERVICIOS:
 * - Controlador: maneja la lógica HTTP (peticiones/respuestas)
 * - Servicio: maneja la lógica de negocio (BD, cálculos, etc)
 * 
 * QUIEN DEPENDE DE ESTO:
 * - routes/users.js: cada ruta llama a un controlador
 * 
 * QUIEN DEPENDE DEL CONTROLADOR:
 * - services/usersService.js: el controlador llama servicios
 * 
 * SIN ESTO: No habría forma de conectar rutas con servicios
 */

const usersService = require('../usuarios/usuario.service');

/**
 * Obtiene TODOS los usuarios
 * HTTP: GET /users
 * 
 * FLUJO:
 * 1. Llama al servicio getAllUsers()
 * 2. El servicio ejecuta: SELECT * FROM usuarios
 * 3. Devuelve array de usuarios
 * 4. Responde al cliente con los datos
 * 5. Si falla, pasa error al manejador de errores
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users); // Responde con status 200 por defecto
  } catch (err) {
    next(err); // Pasa el error al middleware de errores
  }
};

/**
 * Obtiene UN usuario por ID
 * HTTP: GET /users/:id
 * 
 * PARÁMETROS:
 * - req.params.id: ID del usuario en la URL
 * 
 * FLUJO:
 * 1. Extrae el ID de la URL
 * 2. Llama al servicio con ese ID
 * 3. Servicio busca en BD y lanza error si no existe (404)
 * 4. Devuelve los datos del usuario encontrado
 * 
 * POSIBLES ERRORES:
 * - 404: Usuario no encontrado (el servicio lanza este error)
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Crea un nuevo usuario
 * HTTP: POST /users
 * 
 * PARÁMETROS:
 * - req.body: { name, email, password }
 * 
 * VALIDACIONES (se hacen antes en middlewares):
 * - name: no vacío
 * - email: formato válido
 * - password: mínimo 6 caracteres
 * 
 * FLUJO:
 * 1. Datos ya están validados (pasaron por validateUser + runValidations)
 * 2. Llama al servicio createUser() con los datos
 * 3. Servicio encripta la password con bcrypt
 * 4. Servicio inserta en BD: INSERT INTO usuarios(...)
 * 5. BD devuelve el usuario creado
 * 6. Responde con status 201 (Created) y datos del usuario
 * 
 * QUÉ PASA INTERNAMENTE:
 * - La password se encripta (nunca se guarda en texto plano)
 * - Se devuelve lo creado para confirmación
 * 
 * SIN VALIDACIÓN: podrían guardarse datos corruptos
 */
const createUser = async (req, res, next) => {
  try {
    const newUser = await usersService.createUser(req.body);
    res.status(201).json(newUser); // 201 = Created (éxito creando recurso)
  } catch (err) {
    next(err);
  }
};

/**
 * Actualiza UN usuario (todos los campos)
 * HTTP: PUT /users/:id
 * 
 * PARÁMETROS:
 * - req.params.id: ID del usuario
 * - req.body: { name, email } (nota: password NO en PUT)
 * 
 * FLUJO:
 * 1. Extrae ID y datos del usuario
 * 2. Llama al servicio updateUser()
 * 3. Servicio ejecuta: UPDATE usuarios SET name=..., email=... WHERE id=...
 * 4. Devuelve datos actualizados
 * 
 * NOTA: En PUT se actualizan TODOS los campos especificados
 * Si hay campos faltantes, puede causar errores
 * Para actualización parcial, usa PATCH
 */
const updateUser = async (req, res, next) => {
  try {
    const updated = await usersService.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Elimina UN usuario
 * HTTP: DELETE /users/:id
 * 
 * PARÁMETROS:
 * - req.params.id: ID del usuario a eliminar
 * 
 * FLUJO:
 * 1. Llama al servicio deleteUser() con el ID
 * 2. Servicio ejecuta: DELETE FROM usuarios WHERE id=...
 * 3. Devuelve mensaje de confirmación
 * 4. Si usuario no existe, lanza error 404
 * 
 * CUIDADO: Esta operación es IRREVERSIBLE
 * El usuario se elimina permanentemente de la BD
 */
const deleteUser = async (req, res, next) => {
  try {
    const result = await usersService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Actualiza UN usuario (solo campos específicos)
 * HTTP: PATCH /users/:id
 * 
 * PARÁMETROS:
 * - req.params.id: ID del usuario
 * - req.body: solo los campos a actualizar
 *   Ejemplos:
 *   - { name: "Juan" } - solo actualiza nombre
 *   - { email: "nuevo@mail.com" } - solo email
 *   - { name: "Juan", password: "nueva123" } - nombre y password
 * 
 * FLUJO:
 * 1. Extrae ID y datos
 * 2. Llama al servicio partialUpdateUser()
 * 3. Servicio construye dinámicamente el SQL UPDATE
 * 4. Solo actualiza los campos enviados
 * 5. Devuelve datos actualizados
 * 
 * VENTAJA SOBRE PUT:
 * - Más flexible: no necesitas enviar TODOS los datos
 * - Más seguro: solo cambias lo que quieres cambiar
 */
const partialUpdateUser = async (req, res, next) => {
  try {
    const updated = await usersService.partialUpdateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene UN usuario por EMAIL
 * HTTP: GET /users/email/:email
 * 
 * PARÁMETROS:
 * - req.params.email: email del usuario
 * 
 * FLUJO:
 * 1. Extrae email de la URL
 * 2. Llama al servicio getUserByEmail()
 * 3. Servicio ejecuta: SELECT * FROM usuarios WHERE email=...
 * 4. Si no encuentra, lanza error 404
 * 5. Devuelve los datos del usuario
 * 
 * CASOS DE USO:
 * - Verificar si un email está registrado
 * - Buscar usuario por email
 * - Recuperar email de contraseña
 */
const getUserByEmail = async (req, res, next) => {
  try {
    const user = await usersService.getUserByEmail(req.params.email);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Verifica si UN email EXISTE en la BD
 * HTTP: GET /users/check/email?email=...
 * 
 * PARÁMETROS:
 * - req.query.email: email a verificar (parámetro query string)
 * 
 * RESPUESTA:
 * - { exists: true } si el email está registrado
 * - { exists: false } si el email está disponible
 * 
 * FLUJO:
 * 1. Extrae email del query string
 * 2. Valida que email no esté vacío
 * 3. Llama al servicio checkEmailExists()
 * 4. Servicio ejecuta: SELECT id FROM usuarios WHERE email=...
 * 5. Devuelve true/false
 * 
 * CASOS DE USO:
 * - Validación en frontend durante registro
 * - Verificar disponibilidad antes de crear usuario
 * - Evitar duplicados
 */
const checkEmailExists = async (req, res, next) => {
  try {
    const email = req.query.email; // Obtiene del query string
    
    // Valida que el email sea proporcionado
    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }
    
    const exists = await usersService.checkEmailExists(email);
    res.json({ exists });
  } catch (err) {
    next(err);
  }
};

// Exporta todos los controladores para que routes los pueda usar
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
