/**
 * CONEXIÓN A BASE DE DATOS - db.js
 * ================================
 * Este archivo crea y exporta la conexión a PostgreSQL.
 * 
 * FLUJO:
 * 1. Carga las credenciales del .env
 * 2. Crea un Pool (grupo de conexiones) a PostgreSQL
 * 3. Exporta el pool para que otros archivos lo usen
 * 
 * QUIEN DEPENDE DE ESTO:
 * - services/usersService.js: usa db.query() para ejecutar SQL
 * 
 * VARIABLES DEL .env QUE NECESITA:
 * - DB_USER: usuario de PostgreSQL (ej: postgres)
 * - DB_HOST: servidor donde está PostgreSQL (ej: localhost)
 * - DB_NAME: nombre de la base de datos (ej: mibase)
 * - DB_PASSWORD: contraseña de PostgreSQL
 * - DB_PORT: puerto de PostgreSQL (ej: 5432)
 * 
 * QUÉ PASA SI FALTA:
 * - Si faltan credenciales: los servicios no pueden conectar a BD
 * - Si falta .env: la aplicación no tiene donde leer las credenciales
 * - Sin esto: no se puede guardar/obtener datos de la BD
 */

require('dotenv').config();
const { Pool } = require('pg');

// Crea un pool de conexiones a PostgreSQL
// Usa variables de entorno para las credenciales
const pool = new Pool({
  user: process.env.DB_USER,        // Usuario PostgreSQL
  host: process.env.DB_HOST,        // Servidor
  database: process.env.DB_NAME,    // Base de datos
  password: process.env.DB_PASSWORD, // Contraseña
  port: process.env.DB_PORT         // Puerto
});

// Exporta el pool para que usersService pueda hacer queries
module.exports = pool;
