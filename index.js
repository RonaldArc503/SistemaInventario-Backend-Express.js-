require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./src/modules/usuarios/usuario.routes'));
app.use('/api/productos', require('./src/modules/productos/producto.routes'));

// Middleware de errores (SIEMPRE al final)
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Ruta base
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Usuarios!');
});

// Puerto
const PORT = process.env.PORT || 3000;

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});