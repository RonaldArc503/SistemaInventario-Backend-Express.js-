const db = require('../../utils/db');

const MOVIMIENTO_COLUMNS = `
	id,
	producto_id,
	usuario_id,
	tipo_movimiento_id,
	cantidad_cambio,
	stock_resultante,
	venta_id,
	notas,
	fecha_creacion
`;

const getMovimientoStockById = async (id) => {
	const result = await db.query(
		`SELECT ${MOVIMIENTO_COLUMNS} FROM movimientos_stock WHERE id = $1`,
		[id]
	);

	if (result.rows.length === 0) {
		const error = new Error('Movimiento de stock no encontrado');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

const lockProductos = async (client, productoIds = []) => {
	const uniqueIds = [...new Set(productoIds.filter((id) => id !== undefined && id !== null).map(Number))]
		.sort((a, b) => a - b);

	if (uniqueIds.length === 0) {
		return;
	}

	await client.query(
		'SELECT id FROM productos WHERE id = ANY($1::int[]) FOR UPDATE',
		[uniqueIds]
	);
};

const recalcularStockProducto = async (client, productoId) => {
	const movimientosResult = await client.query(
		`SELECT id, cantidad_cambio
		 FROM movimientos_stock
		 WHERE producto_id = $1
		 ORDER BY fecha_creacion ASC, id ASC`,
		[productoId]
	);

	let stockActual = 0;

	for (const movimiento of movimientosResult.rows) {
		stockActual += Number(movimiento.cantidad_cambio);

		await client.query(
			'UPDATE movimientos_stock SET stock_resultante = $1 WHERE id = $2',
			[stockActual, movimiento.id]
		);
	}

	await client.query(
		'UPDATE productos SET stock_actual = $1, fecha_actualizacion = now() WHERE id = $2',
		[stockActual, productoId]
	);

	return stockActual;
};

const getAllMovimientosStock = async () => {
	const result = await db.query(
		`SELECT ${MOVIMIENTO_COLUMNS} FROM movimientos_stock ORDER BY id DESC`
	);

	return result.rows;
};

const getMovimientoStock = async (id) => getMovimientoStockById(id);

const createMovimientoStock = async (data = {}) => {
	const client = await db.connect();

	try {
		await client.query('BEGIN');

		await lockProductos(client, [data.producto_id]);

		const productoResult = await client.query(
			'SELECT id, stock_actual FROM productos WHERE id = $1',
			[data.producto_id]
		);

		if (productoResult.rows.length === 0) {
			const error = new Error('Producto no encontrado');
			error.status = 404;
			throw error;
		}

		const stockActual = Number(productoResult.rows[0].stock_actual ?? 0);
		const cantidadCambio = Number(data.cantidad_cambio);
		const stockResultante = stockActual + cantidadCambio;

		if (stockResultante < 0) {
			const error = new Error('El stock no puede quedar en negativo');
			error.status = 400;
			throw error;
		}

		const insertResult = await client.query(
			`INSERT INTO movimientos_stock (
				producto_id,
				usuario_id,
				tipo_movimiento_id,
				cantidad_cambio,
				stock_resultante,
				venta_id,
				notas
			) VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id`,
			[
				data.producto_id,
				data.usuario_id,
				data.tipo_movimiento_id,
				cantidadCambio,
				stockResultante,
				data.venta_id ?? null,
				data.notas ?? null
			]
		);

		await recalcularStockProducto(client, data.producto_id);

		const movementId = insertResult.rows[0].id;
		const movementResult = await client.query(
			`SELECT ${MOVIMIENTO_COLUMNS} FROM movimientos_stock WHERE id = $1`,
			[movementId]
		);

		await client.query('COMMIT');

		return movementResult.rows[0];
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
};

const updateMovimientoStock = async (id, data = {}) => {
	const client = await db.connect();

	try {
		await client.query('BEGIN');

		const existingResult = await client.query(
			`SELECT id, producto_id, usuario_id, tipo_movimiento_id, cantidad_cambio, venta_id, notas
			 FROM movimientos_stock
			 WHERE id = $1
			 FOR UPDATE`,
			[id]
		);

		if (existingResult.rows.length === 0) {
			const error = new Error('Movimiento de stock no encontrado');
			error.status = 404;
			throw error;
		}

		const existing = existingResult.rows[0];
		const updated = {
			producto_id: data.producto_id ?? existing.producto_id,
			usuario_id: data.usuario_id ?? existing.usuario_id,
			tipo_movimiento_id: data.tipo_movimiento_id ?? existing.tipo_movimiento_id,
			cantidad_cambio: data.cantidad_cambio ?? existing.cantidad_cambio,
			venta_id: Object.prototype.hasOwnProperty.call(data, 'venta_id')
				? data.venta_id
				: existing.venta_id,
			notas: Object.prototype.hasOwnProperty.call(data, 'notas')
				? data.notas
				: existing.notas
		};

		await lockProductos(client, [existing.producto_id, updated.producto_id]);

		const productoResult = await client.query(
			'SELECT id, stock_actual FROM productos WHERE id = $1',
			[updated.producto_id]
		);

		if (productoResult.rows.length === 0) {
			const error = new Error('Producto no encontrado');
			error.status = 404;
			throw error;
		}

		const stockActual = Number(productoResult.rows[0].stock_actual ?? 0);
		const cantidadCambio = Number(updated.cantidad_cambio);
		const stockResultante = stockActual + cantidadCambio;

		if (stockResultante < 0) {
			const error = new Error('El stock no puede quedar en negativo');
			error.status = 400;
			throw error;
		}

		await client.query(
			`UPDATE movimientos_stock SET
				producto_id = $1,
				usuario_id = $2,
				tipo_movimiento_id = $3,
				cantidad_cambio = $4,
				stock_resultante = $5,
				venta_id = $6,
				notas = $7
			WHERE id = $8`,
			[
				updated.producto_id,
				updated.usuario_id,
				updated.tipo_movimiento_id,
				cantidadCambio,
				stockResultante,
				updated.venta_id,
				updated.notas,
				id
			]
		);

		if (existing.producto_id !== updated.producto_id) {
			await recalcularStockProducto(client, existing.producto_id);
		}

		await recalcularStockProducto(client, updated.producto_id);

		const movementResult = await client.query(
			`SELECT ${MOVIMIENTO_COLUMNS} FROM movimientos_stock WHERE id = $1`,
			[id]
		);

		await client.query('COMMIT');

		return movementResult.rows[0];
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
};

const partialUpdateMovimientoStock = async (id, data = {}) => {
	return updateMovimientoStock(id, data);
};

const deleteMovimientoStock = async (id) => {
	const client = await db.connect();

	try {
		await client.query('BEGIN');

		const existingResult = await client.query(
			`SELECT id, producto_id
			 FROM movimientos_stock
			 WHERE id = $1
			 FOR UPDATE`,
			[id]
		);

		if (existingResult.rows.length === 0) {
			const error = new Error('Movimiento de stock no encontrado');
			error.status = 404;
			throw error;
		}

		const existing = existingResult.rows[0];

		await lockProductos(client, [existing.producto_id]);

		await client.query('DELETE FROM movimientos_stock WHERE id = $1', [id]);
		await recalcularStockProducto(client, existing.producto_id);

		await client.query('COMMIT');

		return { message: 'Movimiento de stock eliminado' };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
};

module.exports = {
	getAllMovimientosStock,
	getMovimientoStock,
	getMovimientoStockById,
	createMovimientoStock,
	updateMovimientoStock,
	partialUpdateMovimientoStock,
	deleteMovimientoStock
};
