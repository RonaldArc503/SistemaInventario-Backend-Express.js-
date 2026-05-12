const service = require('./tipoProducto.service');

const getAllTiposProducto = async (req, res, next) => {
  try {
    const data = await service.getAllTiposProducto();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getTipoProductoById = async (req, res, next) => {
  try {
    const data = await service.getTipoProductoById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createTipoProducto = async (req, res, next) => {
  try {
    const data = await service.createTipoProducto(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateTipoProducto = async (req, res, next) => {
  try {
    const data = await service.updateTipoProducto(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateTipoProducto = async (req, res, next) => {
  try {
    const data = await service.partialUpdateTipoProducto(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteTipoProducto = async (req, res, next) => {
  try {
    const data = await service.deleteTipoProducto(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTiposProducto,
  getTipoProductoById,
  createTipoProducto,
  updateTipoProducto,
  partialUpdateTipoProducto,
  deleteTipoProducto
};module.exports = {};
