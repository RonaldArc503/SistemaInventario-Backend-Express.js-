const service = require('./cliente.service');

const getAllClientes = async (req, res, next) => {
  try {
    const data = await service.getAllClientes();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getClienteById = async (req, res, next) => {
  try {
    const data = await service.getClienteById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createCliente = async (req, res, next) => {
  try {
    const data = await service.createCliente(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const data = await service.updateCliente(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateCliente = async (req, res, next) => {
  try {
    const data = await service.partialUpdateCliente(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteCliente = async (req, res, next) => {
  try {
    const data = await service.deleteCliente(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  partialUpdateCliente,
  deleteCliente
};