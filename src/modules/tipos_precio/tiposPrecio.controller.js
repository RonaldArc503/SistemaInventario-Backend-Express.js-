const service = require('./tiposPrecio.service');

const getAllTiposPrecio = async (req, res, next) => {
  try {
    const data = await service.getAllTiposPrecio();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getTipoPrecioById = async (req, res, next) => {
  try {
    const data = await service.getTipoPrecioById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createTipoPrecio = async (req, res, next) => {
  try {
    const data = await service.createTipoPrecio(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateTipoPrecio = async (req, res, next) => {
  try {
    const data = await service.updateTipoPrecio(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateTipoPrecio = async (req, res, next) => {
  try {
    const data = await service.partialUpdateTipoPrecio(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteTipoPrecio = async (req, res, next) => {
  try {
    const data = await service.deleteTipoPrecio(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTiposPrecio,
  getTipoPrecioById,
  createTipoPrecio,
  updateTipoPrecio,
  partialUpdateTipoPrecio,
  deleteTipoPrecio
};