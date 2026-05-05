/**
 * ARCHIVO PRINCIPAL - index.js
 * ============================
 * Este es el punto de entrada de la aplicación Express.
 * 
 * FLUJO:
 * 1. Carga variables de entorno (.env)
 * 2. Inicializa Express
 * 3. Importa las rutas y middleware
 * 4. Configura middleware (parseo JSON, rutas, manejo de errores)
 * 5. Inicia el servidor en puerto 3000
 * 
 * DEPENDENCIAS:
 * - dotenv: carga variables del archivo .env
 * - express: framework web
 * - routes/users.js: define todas las rutas del API
 * - middlewares/errorHandler.js: maneja errores globales
 * 
 * SIN ESTO: La aplicación no funcionaría, no habría servidor ejecutándose
 */

require('dotenv').config(); // Carga variables de entorno (DB_USER, DB_PASSWORD, etc)
const express = require('express');
const app = express();

// Importar rutas y middleware
const usersRoutes = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Rutas de la aplicación: todas las rutas de usuarios comienzan con /users
app.use('/users', usersRoutes);

// Middleware de manejo de errores (SIEMPRE DEBE IR AL FINAL)
// Si algo falla en routes o controllers, este middleware lo captura
app.use(errorHandler);

// Obtiene el puerto desde .env o usa 3000 por defecto
const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
