const service = require('./estadoVenta.service');

const getAllEstadosVenta = async (req, res, next) => {
  try {
    const data = await service.getAllEstadosVenta();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getEstadoVentaById = async (req, res, next) => {
  try {
    const data = await service.getEstadoVentaById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createEstadoVenta = async (req, res, next) => {
  try {
    const data = await service.createEstadoVenta(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateEstadoVenta = async (req, res, next) => {
  try {
    const data = await service.updateEstadoVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateEstadoVenta = async (req, res, next) => {
  try {
    const data = await service.partialUpdateEstadoVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteEstadoVenta = async (req, res, next) => {
  try {
    const data = await service.deleteEstadoVenta(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEstadosVenta,
  getEstadoVentaById,
  createEstadoVenta,
  updateEstadoVenta,
  partialUpdateEstadoVenta,
  deleteEstadoVenta
};