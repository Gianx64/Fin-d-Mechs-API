import { pool } from "./pool.js";

export const carQueries = {
carsRead:       "SELECT * FROM cars WHERE id_usuario = $1 AND activo = TRUE",
carsReadForm:   "SELECT * FROM cars WHERE id_usuario = $1 AND cita = FALSE AND activo = TRUE",
carCreate:      "INSERT INTO cars (id_usuario, patente, vin, marca, modelo, anualidad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
carReadPlate:   "SELECT id_usuario FROM cars WHERE patente = $1 AND activo = TRUE",
carReadVIN:     "SELECT id_usuario FROM cars WHERE vin = $1 AND activo = TRUE",
carClean:       "UPDATE cars SET cita = FALSE WHERE id = $1",
carUpdate:      "UPDATE cars SET (patente, vin, marca, modelo, anualidad) = ($1, $2, $3, $4, $5) WHERE id = $6 AND cita = FALSE",
carUpdateVIN:   "UPDATE cars SET vin = $1 WHERE id = $2 AND activo = TRUE",
carAppointed:   "UPDATE cars SET (cita, citado) = (TRUE, TRUE) WHERE id = $1",
carDeactivate:  "UPDATE cars SET activo = FALSE WHERE id = $1"
}

function carsRead(id) {
  try {
    return new Promise((resolve) => {
      pool.query(carQueries.carsRead, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carsReadForm(id) {
  try {
    return new Promise((resolve) => {
      pool.query(carQueries.carsReadForm, [id], (err, result) => {
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
      pool.query(carQueries.carCreate, [data.id_usuario, data.patente, data.vin, data.marca, data.modelo, data.anualidad], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows[0]});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carReadPlate(patente) {
  try {
    return new Promise((resolve) => {
      pool.query(carQueries.carReadPlate, [patente], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carReadVIN(vin) {
  try {
    return new Promise((resolve) => {
      pool.query(carQueries.carReadVIN, [vin], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carUpdate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(carQueries.carUpdate, [data.patente, data.vin, data.marca, data.modelo, data.anualidad, data.id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function carUpdateVIN(vin, id) {
  try {
    return new Promise((resolve) => {
      pool.query(carQueries.carUpdateVIN, [vin, id], (err, result) => {
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
      pool.query(carQueries.carDeactivate, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  carQueries,
  carsRead,
  carsReadForm,
  carCreate,
  carReadPlate,
  carReadVIN,
  carUpdate,
  carUpdateVIN,
  carDeactivate
}