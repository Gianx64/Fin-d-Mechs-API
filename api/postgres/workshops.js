import { pool } from "./pool.js";

export const workshopQueries = {
workshopsRead:      "SELECT * FROM workshops WHERE activo = TRUE",
workshopsNotRead:   `SELECT workshops.*, users.nombre as user_nombre, users.celular as user_celular, users.correo as user_correo
                      FROM workshops INNER JOIN users ON workshops.id_usuario = users.id WHERE workshops.verificado IS NULL`,
workshopsReadMech:  "SELECT * FROM workshops WHERE id_usuario = $1 AND activo = TRUE",
workshopReadMechs:  `SELECT users.id, users.nombre, users.celular, users.correo FROM workshopmechs
                      INNER JOIN users ON workshopmechs.id_mech = users.id WHERE workshopmechs.id_workshop = $1`,
workshopCreate:     "INSERT INTO workshops (id_usuario, nombre, ciudad, direccion, detalles) VALUES ($1, $2, $3, $4, $5) RETURNING *",
workshopUpdate:     "UPDATE workshops SET (nombre, ciudad, direccion, detalles) = ($1, $2, $3, $4) WHERE id = $5",
workshopUpgrade:    "UPDATE workshops SET (verificado, verificadopor) = (NOW(), $1) WHERE id = $2",
workshopAppointed:  "UPDATE workshops SET citado = TRUE WHERE id = $1",
workshopDeactivate: "UPDATE workshops SET activo = FALSE WHERE id = $1 AND cita = FALSE"
}

function workshopsRead() {
  try {
    return new Promise((resolve) => {
      pool.query(workshopQueries.workshopsRead, (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopsNotRead() {
  try {
    return new Promise((resolve) => {
      pool.query(workshopQueries.workshopsNotRead, (err, result) => {
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
      pool.query(workshopQueries.workshopsReadMech, [id], (err, result) => {
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
      pool.query(workshopQueries.workshopReadMechs, [id], (err, result) => {
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
      pool.query(workshopQueries.workshopCreate, [data.id_usuario, data.nombre, data.ciudad, data.direccion, data.detalles], (err, result) => {
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
      pool.query(workshopQueries.workshopUpdate, [data.nombre, data.ciudad, data.direccion, data.detalles, data.id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function workshopUpgrade(admin, id) {
  try {
    return new Promise((resolve) => {
      pool.query(workshopQueries.workshopUpgrade, [admin, id], (err, result) => {
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
      pool.query(workshopQueries.workshopDeactivate, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  workshopQueries,
  workshopsRead,
  workshopsNotRead,
  workshopsReadMech,
  workshopReadMechs,
  workshopCreate,
  workshopUpdate,
  workshopUpgrade,
  workshopDeactivate
}