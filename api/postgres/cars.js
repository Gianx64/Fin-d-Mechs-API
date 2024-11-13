import pool from "../postgres.js";

const queries = {
carsRead:       "SELECT * FROM cars WHERE id_usuario = $1",
carCreate:      "INSERT INTO cars (id_usuario, patente, vin, marca, modelo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
carUpdate:      "UPDATE cars SET (patente, vin, marca, modelo) = ($1, $2, $3, $4) WHERE id = $5 AND cita = FALSE",
carDeactivate:  "UPDATE cars SET (activo = FALSE) WHERE id = $1 AND cita = FALSE"
}

function carsRead(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.carsRead, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carCreate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.carCreate, [data.id_usuario, data.patente, data.vin, data.marca, data.modelo], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows[0]});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carUpdate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.carUpdate, [data.patente, data.vin, data.marca, data.modelo, data.id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carDeactivate(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.carDeactivate, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  carsRead,
  carCreate,
  carUpdate,
  carDeactivate
}