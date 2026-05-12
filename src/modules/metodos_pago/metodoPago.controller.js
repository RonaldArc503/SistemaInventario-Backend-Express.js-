const service = require('./metodoPago.service');

const getAllMetodosPago = async (req, res, next) => {
  try {
    const data = await service.getAllMetodosPago();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getMetodoPagoById = async (req, res, next) => {
  try {
    const data = await service.getMetodoPagoById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createMetodoPago = async (req, res, next) => {
  try {
    const data = await service.createMetodoPago(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateMetodoPago = async (req, res, next) => {
  try {
    const data = await service.updateMetodoPago(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateMetodoPago = async (req, res, next) => {
  try {
    const data = await service.partialUpdateMetodoPago(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteMetodoPago = async (req, res, next) => {
  try {
    const data = await service.deleteMetodoPago(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  partialUpdateMetodoPago,
  deleteMetodoPago
};module.exports = {};
