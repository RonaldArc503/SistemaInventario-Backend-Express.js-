const service = require('./preciosProducto.service');

const getAllPreciosProducto = async (req, res, next) => {
  try {
    const data = await service.getAllPreciosProducto();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getPrecioProductoById = async (req, res, next) => {
  try {
    const data = await service.getPrecioProductoById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createPrecioProducto = async (req, res, next) => {
  try {
    const data = await service.createPrecioProducto(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updatePrecioProducto = async (req, res, next) => {
  try {
    const data = await service.updatePrecioProducto(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdatePrecioProducto = async (req, res, next) => {
  try {
    const data = await service.partialUpdatePrecioProducto(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deletePrecioProducto = async (req, res, next) => {
  try {
    const data = await service.deletePrecioProducto(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPreciosProducto,
  getPrecioProductoById,
  createPrecioProducto,
  updatePrecioProducto,
  partialUpdatePrecioProducto,
  deletePrecioProducto
};