const service = require('./tipoMovimiento.service');

const getAllTiposMovimiento = async (req, res, next) => {
	try {
		const data = await service.getAllTiposMovimiento();
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const getTipoMovimientoById = async (req, res, next) => {
	try {
		const data = await service.getTipoMovimientoById(req.params.id);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const createTipoMovimiento = async (req, res, next) => {
	try {
		const data = await service.createTipoMovimiento(req.body);
		res.status(201).json(data);
	} catch (err) {
		next(err);
	}
};

const updateTipoMovimiento = async (req, res, next) => {
	try {
		const data = await service.updateTipoMovimiento(req.params.id, req.body);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const partialUpdateTipoMovimiento = async (req, res, next) => {
	try {
		const data = await service.partialUpdateTipoMovimiento(req.params.id, req.body);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const deleteTipoMovimiento = async (req, res, next) => {
	try {
		const data = await service.deleteTipoMovimiento(req.params.id);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllTiposMovimiento,
	getTipoMovimientoById,
	createTipoMovimiento,
	updateTipoMovimiento,
	partialUpdateTipoMovimiento,
	deleteTipoMovimiento
};
