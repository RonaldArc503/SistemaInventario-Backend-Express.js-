const db = require('../../utils/db');

const DETALLE_COLUMNS = `
  id,
  venta_id,
  producto_id,
  cantidad,
  precio_unitario_momento,
  descuento_linea,
  subtotal_linea
`;

const getVentaResumen = async (client, ventaId) => {
  const result = await client.query(
    `SELECT
      COALESCE(SUM(subtotal_linea), 0) AS subtotal,
      COALESCE(SUM(descuento_linea), 0) AS descuento
     FROM detalle_ventas
     WHERE venta_id = $1`,
    [ventaId]
  );

  return result.rows[0];
};

const updateVentaTotales = async (client, ventaId) => {
  const ventaResumen = await getVentaResumen(client, ventaId);

  const ventaResult = await client.query(
    `SELECT impuesto FROM ventas WHERE id = $1`,
    [ventaId]
  );

  if (ventaResult.rows.length === 0) {
    const error = new Error('Venta no encontrada');
    error.status = 404;
    throw error;
  }

  const impuesto = Number(ventaResult.rows[0].impuesto || 0);
  const subtotal = Number(ventaResumen.subtotal || 0);
  const descuento = Number(ventaResumen.descuento || 0);
  const montoTotal = subtotal - descuento + impuesto;

  await client.query(
    `UPDATE ventas
     SET subtotal = $1,
         monto_total = $2
     WHERE id = $3`,
    [subtotal, montoTotal, ventaId]
  );
};

const getAllDetalleVentas = async () => {
  const result = await db.query(
    `SELECT ${DETALLE_COLUMNS} FROM detalle_ventas ORDER BY id DESC`
  );
  return result.rows;
};

const getDetalleVentaById = async (id) => {
  const result = await db.query(
    `SELECT ${DETALLE_COLUMNS} FROM detalle_ventas WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Detalle de venta no encontrado');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createDetalleVenta = async (data = {}) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO detalle_ventas (
        venta_id,
        producto_id,
        cantidad,
        precio_unitario_momento,
        descuento_linea
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING ${DETALLE_COLUMNS}`,
      [
        data.venta_id,
        data.producto_id,
        data.cantidad,
        data.precio_unitario_momento,
        data.descuento_linea ?? 0
      ]
    );

    await updateVentaTotales(client, data.venta_id);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateDetalleVenta = async (id, data = {}) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      `SELECT venta_id FROM detalle_ventas WHERE id = $1`,
      [id]
    );

    if (currentResult.rows.length === 0) {
      const error = new Error('Detalle de venta no encontrado');
      error.status = 404;
      throw error;
    }

    const currentVentaId = currentResult.rows[0].venta_id;

    const result = await client.query(
      `UPDATE detalle_ventas
       SET venta_id = $1,
           producto_id = $2,
           cantidad = $3,
           precio_unitario_momento = $4,
           descuento_linea = $5
       WHERE id = $6
       RETURNING ${DETALLE_COLUMNS}`,
      [
        data.venta_id,
        data.producto_id,
        data.cantidad,
        data.precio_unitario_momento,
        data.descuento_linea ?? 0,
        id
      ]
    );

    await updateVentaTotales(client, currentVentaId);
    if (data.venta_id !== undefined && data.venta_id !== currentVentaId) {
      await updateVentaTotales(client, data.venta_id);
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const partialUpdateDetalleVenta = async (id, data = {}) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      `SELECT venta_id, producto_id, cantidad, precio_unitario_momento, descuento_linea
       FROM detalle_ventas WHERE id = $1`,
      [id]
    );

    if (currentResult.rows.length === 0) {
      const error = new Error('Detalle de venta no encontrado');
      error.status = 404;
      throw error;
    }

    const current = currentResult.rows[0];
    const updates = {};

    for (const field of ['venta_id', 'producto_id', 'cantidad', 'precio_unitario_momento', 'descuento_linea']) {
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

    const result = await client.query(
      `UPDATE detalle_ventas SET ${setClause} WHERE id = $${values.length} RETURNING ${DETALLE_COLUMNS}`,
      values
    );

    await updateVentaTotales(client, current.venta_id);
    if (updates.venta_id !== undefined && updates.venta_id !== current.venta_id) {
      await updateVentaTotales(client, updates.venta_id);
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteDetalleVenta = async (id) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      `SELECT venta_id FROM detalle_ventas WHERE id = $1`,
      [id]
    );

    if (currentResult.rows.length === 0) {
      const error = new Error('Detalle de venta no encontrado');
      error.status = 404;
      throw error;
    }

    const ventaId = currentResult.rows[0].venta_id;

    const result = await client.query(
      `DELETE FROM detalle_ventas WHERE id = $1 RETURNING ${DETALLE_COLUMNS}`,
      [id]
    );

    await updateVentaTotales(client, ventaId);
    await client.query('COMMIT');

    return { message: 'Detalle de venta eliminado' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getAllDetalleVentas,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  partialUpdateDetalleVenta,
  deleteDetalleVenta
};module.exports = {};
