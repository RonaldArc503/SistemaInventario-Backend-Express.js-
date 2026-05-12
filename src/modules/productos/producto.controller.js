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

const updateProducto = async (req, res, next) => {
  try {
    const data = await service.updateProducto(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateProducto = async (req, res, next) => {
  try {
    const data = await service.partialUpdateProducto(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteProducto = async (req, res, next) => {
  try {
    const data = await service.deleteProducto(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  partialUpdateProducto,
  deleteProducto
};