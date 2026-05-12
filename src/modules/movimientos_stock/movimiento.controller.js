const service = require('./movimiento.service');

const getAllMovimientosStock = async (req, res, next) => {
	try {
		const data = await service.getAllMovimientosStock();
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const getMovimientoStock = async (req, res, next) => {
	try {
		const data = await service.getMovimientoStock(req.params.id);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const createMovimientoStock = async (req, res, next) => {
	try {
		const data = await service.createMovimientoStock(req.body);
		res.status(201).json(data);
	} catch (err) {
		next(err);
	}
};

const updateMovimientoStock = async (req, res, next) => {
	try {
		const data = await service.updateMovimientoStock(req.params.id, req.body);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const partialUpdateMovimientoStock = async (req, res, next) => {
	try {
		const data = await service.partialUpdateMovimientoStock(req.params.id, req.body);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const deleteMovimientoStock = async (req, res, next) => {
	try {
		const data = await service.deleteMovimientoStock(req.params.id);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllMovimientosStock,
	getMovimientoStock,
	createMovimientoStock,
	updateMovimientoStock,
	partialUpdateMovimientoStock,
	deleteMovimientoStock
};
