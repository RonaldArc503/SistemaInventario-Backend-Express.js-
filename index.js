require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./src/modules/usuarios/usuario.routes'));
app.use('/api/productos', require('./src/modules/productos/producto.routes'));
app.use('/api/clientes', require('./src/modules/clientes/cliente.routes'));
app.use('/api/tipos-producto', require('./src/modules/tipos_producto/tipoProducto.routes'));
app.use('/api/materiales', require('./src/modules/materiales/material.routes'));
app.use('/api/roles', require('./src/modules/roles/rol.routes'));
app.use('/api/tipos-precio', require('./src/modules/tipos_precio/tiposPrecio.routes'));
app.use('/api/precios-producto', require('./src/modules/precios_producto/preciosProducto.routes'));
app.use('/api/metodos-pago', require('./src/modules/metodos_pago/metodoPago.routes'));
app.use('/api/estados-venta', require('./src/modules/estados_venta/estadoVenta.routes'));
app.use('/api/ventas', require('./src/modules/ventas/venta.routes'));
app.use('/api/detalle-ventas', require('./src/modules/detalle_ventas/detalleVenta.routes'));
app.use('/api/tipos-movimiento-stock', require('./src/modules/tipos_movimiento/tipoMovimiento.routes'));
app.use('/api/movimientos-stock', require('./src/modules/movimientos_stock/movimiento.routes'));
app.use('/api/cortes-caja', require('./src/modules/caja/corteCaja.routes'));

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