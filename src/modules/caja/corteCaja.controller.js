const service = require('./corteCaja.service');

const getAllCortesCaja = async (req, res, next) => {
	try {
		const data = await service.getAllCortesCaja();
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const getCorteCajaById = async (req, res, next) => {
	try {
		const data = await service.getCorteCajaById(req.params.id);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const createCorteCaja = async (req, res, next) => {
	try {
		const data = await service.createCorteCaja(req.body);
		res.status(201).json(data);
	} catch (err) {
		next(err);
	}
};

const updateCorteCaja = async (req, res, next) => {
	try {
		const data = await service.updateCorteCaja(req.params.id, req.body);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const partialUpdateCorteCaja = async (req, res, next) => {
	try {
		const data = await service.partialUpdateCorteCaja(req.params.id, req.body);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

const deleteCorteCaja = async (req, res, next) => {
	try {
		const data = await service.deleteCorteCaja(req.params.id);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllCortesCaja,
	getCorteCajaById,
	createCorteCaja,
	updateCorteCaja,
	partialUpdateCorteCaja,
	deleteCorteCaja
};
