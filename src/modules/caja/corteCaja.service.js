const db = require('../../utils/db');

const CORTE_CAJA_COLUMNS = `
	id,
	usuario_id,
	fecha_corte,
	hora_apertura,
	hora_cierre,
	efectivo_inicial,
	esperado_efectivo,
	esperado_transferencia,
	esperado_qr,
	declarado_efectivo,
	declarado_transferencia,
	declarado_qr,
	diferencia_efectivo,
	notas
`;

const getAllCortesCaja = async () => {
	const result = await db.query(
		`SELECT ${CORTE_CAJA_COLUMNS} FROM cortes_caja ORDER BY id DESC`
	);

	return result.rows;
};

const getCorteCajaById = async (id) => {
	const result = await db.query(
		`SELECT ${CORTE_CAJA_COLUMNS} FROM cortes_caja WHERE id = $1`,
		[id]
	);

	if (result.rows.length === 0) {
		const error = new Error('Corte de caja no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const createCorteCaja = async (data = {}) => {
	const result = await db.query(
		`INSERT INTO cortes_caja (
			usuario_id,
			fecha_corte,
			hora_apertura,
			hora_cierre,
			efectivo_inicial,
			esperado_efectivo,
			esperado_transferencia,
			esperado_qr,
			declarado_efectivo,
			declarado_transferencia,
			declarado_qr,
			notas
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING ${CORTE_CAJA_COLUMNS}`,
		[
			data.usuario_id,
			data.fecha_corte ?? new Date(),
			data.hora_apertura,
			data.hora_cierre ?? null,
			data.efectivo_inicial ?? 0,
			data.esperado_efectivo ?? 0,
			data.esperado_transferencia ?? 0,
			data.esperado_qr ?? 0,
			data.declarado_efectivo ?? null,
			data.declarado_transferencia ?? null,
			data.declarado_qr ?? null,
			data.notas ?? null
		]
	);

	return result.rows[0];
};

const updateCorteCaja = async (id, data = {}) => {
	const result = await db.query(
		`UPDATE cortes_caja
		 SET usuario_id = $1,
				 fecha_corte = $2,
				 hora_apertura = $3,
				 hora_cierre = $4,
				 efectivo_inicial = $5,
				 esperado_efectivo = $6,
				 esperado_transferencia = $7,
				 esperado_qr = $8,
				 declarado_efectivo = $9,
				 declarado_transferencia = $10,
				 declarado_qr = $11,
				 notas = $12
		 WHERE id = $13
		 RETURNING ${CORTE_CAJA_COLUMNS}`,
		[
			data.usuario_id,
			data.fecha_corte ?? new Date(),
			data.hora_apertura,
			data.hora_cierre ?? null,
			data.efectivo_inicial ?? 0,
			data.esperado_efectivo ?? 0,
			data.esperado_transferencia ?? 0,
			data.esperado_qr ?? 0,
			data.declarado_efectivo ?? null,
			data.declarado_transferencia ?? null,
			data.declarado_qr ?? null,
			data.notas ?? null,
			id
		]
	);

	if (result.rows.length === 0) {
		const error = new Error('Corte de caja no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const partialUpdateCorteCaja = async (id, data = {}) => {
	const allowedFields = [
		'usuario_id',
		'fecha_corte',
		'hora_apertura',
		'hora_cierre',
		'efectivo_inicial',
		'esperado_efectivo',
		'esperado_transferencia',
		'esperado_qr',
		'declarado_efectivo',
		'declarado_transferencia',
		'declarado_qr',
		'notas'
	];
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
		`UPDATE cortes_caja SET ${setClause} WHERE id = $${values.length} RETURNING ${CORTE_CAJA_COLUMNS}`,
		values
	);

	if (result.rows.length === 0) {
		const error = new Error('Corte de caja no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const deleteCorteCaja = async (id) => {
	const result = await db.query(
		`DELETE FROM cortes_caja WHERE id = $1 RETURNING ${CORTE_CAJA_COLUMNS}`,
		[id]
	);

	if (result.rows.length === 0) {
		const error = new Error('Corte de caja no encontrado');
		error.status = 404;
		throw error;
	}

	return { message: 'Corte de caja eliminado' };
};

module.exports = {
	getAllCortesCaja,
	getCorteCajaById,
	createCorteCaja,
	updateCorteCaja,
	partialUpdateCorteCaja,
	deleteCorteCaja
};
