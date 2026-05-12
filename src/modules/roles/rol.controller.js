const service = require('./rol.service');

const getAllRoles = async (req, res, next) => {
  try {
    const data = await service.getAllRoles();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const data = await service.getRoleById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createRole = async (req, res, next) => {
  try {
    const data = await service.createRole(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const data = await service.updateRole(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateRole = async (req, res, next) => {
  try {
    const data = await service.partialUpdateRole(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const data = await service.deleteRole(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  partialUpdateRole,
  deleteRole
};module.exports = {};
