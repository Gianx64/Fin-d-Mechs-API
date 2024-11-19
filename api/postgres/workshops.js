import { pool } from "./pool.js";

const queries = {
workshopsRead:      "SELECT * FROM workshops WHERE activo = TRUE",
workshopsReadMech:  "SELECT * FROM workshops WHERE id_usuario = $1 AND activo = TRUE",
workshopReadMechs:  `SELECT users.id, users.nombre, users.celular, users.correo FROM workshopmechs WHERE id_workshop = $1
                      RIGHT JOIN users ON workshopmechs.id_mech = users.id`,
workshopCreate:     "INSERT INTO workshops (id_usuario, ciudad, direccion, detalles) VALUES ($1, $2, $3, $4) RETURNING *",
workshopUpdate:     "UPDATE workshops SET (ciudad, direccion, detalles) = ($1, $2, $3) WHERE id = $4",
workshopDeactivate: "UPDATE workshops SET (activo) = (FALSE) WHERE id = $1"
}

function workshopsRead() {
  try {
    return new Promise((resolve) => {
      pool.query(queries.workshopsRead, (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopsReadMech(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.workshopsReadMech, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopReadMechs(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.workshopReadMechs, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopCreate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.workshopCreate, [data.id_usuario, data.ciudad, data.direccion, data.detalles], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows[0]});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopUpdate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.workshopUpdate, [data.ciudad, data.direccion, data.detalles, data.id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopDeactivate(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.workshopDeactivate, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  workshopsRead,
  workshopsReadMech,
  workshopReadMechs,
  workshopCreate,
  workshopUpdate,
  workshopDeactivate
}