const service = require('./detalleVenta.service');

const getAllDetalleVentas = async (req, res, next) => {
  try {
    const data = await service.getAllDetalleVentas();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getDetalleVentaById = async (req, res, next) => {
  try {
    const data = await service.getDetalleVentaById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createDetalleVenta = async (req, res, next) => {
  try {
    const data = await service.createDetalleVenta(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateDetalleVenta = async (req, res, next) => {
  try {
    const data = await service.updateDetalleVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateDetalleVenta = async (req, res, next) => {
  try {
    const data = await service.partialUpdateDetalleVenta(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteDetalleVenta = async (req, res, next) => {
  try {
    const data = await service.deleteDetalleVenta(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDetalleVentas,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  partialUpdateDetalleVenta,
  deleteDetalleVenta
};