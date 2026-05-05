const prisma = require('../../config/prisma');

// 🔍 Obtener todos
const getAllProductos = async () => {
  return await prisma.producto.findMany();
};

// 🔍 Obtener por ID
const getProductoById = async (id) => {
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) }
  });

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  return producto;
};

// ➕ Crear
const createProducto = async (data) => {
  return await prisma.producto.create({
    data: {
      sku: data.sku,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio_costo: data.precio_costo,
      stock_actual: data.stock_actual || 0
    }
  });
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto
};