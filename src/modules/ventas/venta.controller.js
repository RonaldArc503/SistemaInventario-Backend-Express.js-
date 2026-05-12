const service = require('./venta.service');

const getAllVentas = async (req, res, next) => {
  try {
    const data = await service.getAllVentas();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getVentaById = async (req, res, next) => {
  try {
    const data = await service.getVentaById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createVenta = async (req, res, next) => {
  try {
    const data = await service.createVenta(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateVenta = async (req, res, next) => {
  try {
    const data = await service.updateVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateVenta = async (req, res, next) => {
  try {
    const data = await service.partialUpdateVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteVenta = async (req, res, next) => {
  try {
    const data = await service.deleteVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const annulVenta = async (req, res, next) => {
  try {
    const data = await service.annulVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  partialUpdateVenta,
  deleteVenta,
  annulVenta
};module.exports = {};
