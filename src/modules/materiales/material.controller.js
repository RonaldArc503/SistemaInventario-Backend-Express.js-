const service = require('./material.service');

const getAllMateriales = async (req, res, next) => {
  try {
    const data = await service.getAllMateriales();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getMaterialById = async (req, res, next) => {
  try {
    const data = await service.getMaterialById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const data = await service.createMaterial(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const data = await service.updateMaterial(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const partialUpdateMaterial = async (req, res, next) => {
  try {
    const data = await service.partialUpdateMaterial(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const data = await service.deleteMaterial(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMateriales,
  getMaterialById,
  createMaterial,
  updateMaterial,
  partialUpdateMaterial,
  deleteMaterial
};module.exports = {};
