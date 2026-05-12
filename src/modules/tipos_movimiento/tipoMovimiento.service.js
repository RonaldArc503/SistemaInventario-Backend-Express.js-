const db = require('../../utils/db');

const TIPO_MOVIMIENTO_COLUMNS = `
	id,
	nombre
`;

const getAllTiposMovimiento = async () => {
	const result = await db.query(
		`SELECT ${TIPO_MOVIMIENTO_COLUMNS} FROM tipos_movimiento_stock ORDER BY id DESC`
	);
	return result.rows;
};

const getTipoMovimientoById = async (id) => {
	const result = await db.query(
		`SELECT ${TIPO_MOVIMIENTO_COLUMNS} FROM tipos_movimiento_stock WHERE id = $1`,
		[id]
	);

	if (result.rows.length === 0) {
		const error = new Error('Tipo de movimiento no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const createTipoMovimiento = async (data = {}) => {
	const result = await db.query(
		`INSERT INTO tipos_movimiento_stock (nombre)
		 VALUES ($1)
		 RETURNING ${TIPO_MOVIMIENTO_COLUMNS}`,
		[data.nombre]
	);

	return result.rows[0];
};

const updateTipoMovimiento = async (id, data = {}) => {
	const result = await db.query(
		`UPDATE tipos_movimiento_stock
		 SET nombre = $1
		 WHERE id = $2
		 RETURNING ${TIPO_MOVIMIENTO_COLUMNS}`,
		[data.nombre, id]
	);

	if (result.rows.length === 0) {
		const error = new Error('Tipo de movimiento no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const partialUpdateTipoMovimiento = async (id, data = {}) => {
	const allowedFields = ['nombre'];
	const updates = {};

	for (const field of allowedFields) {
		if (data[field] !== undefined) {
			updates[field] = data[field];
		}
	}

	if (Object.keys(updates).length === 0) {
		const error = new Error('No hay campos para actualizar');
		error.status = 400;
		throw error;
	}

	const setClause = Object.keys(updates)
		.map((key, index) => `${key} = $${index + 1}`)
		.join(', ');
	const values = [...Object.values(updates), id];

	const result = await db.query(
		`UPDATE tipos_movimiento_stock SET ${setClause} WHERE id = $${values.length} RETURNING ${TIPO_MOVIMIENTO_COLUMNS}`,
		values
	);

	if (result.rows.length === 0) {
		const error = new Error('Tipo de movimiento no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const deleteTipoMovimiento = async (id) => {
	const result = await db.query(
		`DELETE FROM tipos_movimiento_stock WHERE id = $1 RETURNING ${TIPO_MOVIMIENTO_COLUMNS}`,
		[id]
	);

	if (result.rows.length === 0) {
		const error = new Error('Tipo de movimiento no encontrado');
		error.status = 404;
		throw error;
	}

	return { message: 'Tipo de movimiento eliminado' };
};

module.exports = {
	getAllTiposMovimiento,
	getTipoMovimientoById,
	createTipoMovimiento,
	updateTipoMovimiento,
	partialUpdateTipoMovimiento,
	deleteTipoMovimiento
};
