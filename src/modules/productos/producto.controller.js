const service = require('./producto.service');

const getAllProductos = async (req, res, next) => {
  try {
    const data = await service.getAllProductos();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getProductoById = async (req, res, next) => {
  try {
    const data = await service.getProductoById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createProducto = async (req, res, next) => {
  try {
    const data = await service.createProducto(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto
};