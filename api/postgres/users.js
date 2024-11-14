import { pool } from "./pool.js";

const queries = {
readMechs:        "SELECT id, nombre, correo FROM users WHERE rol = '10'",
userDeactivated:  "SELECT * FROM users WHERE correo = $1 AND activo = FALSE",
userCreate:       "INSERT INTO users (nombre, celular, correo, clave, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
userRead:         "SELECT * FROM users WHERE correo = $1 AND activo = TRUE",
userClean:        "UPDATE users SET (cita) = (NULL) WHERE id = $1 AND activo = TRUE",
userUpdate:       "UPDATE users SET (nombre, celular, correo, clave, rol) = ($1, $2, $3, $4, $5) WHERE id = $6 AND activo = TRUE",
userUpgrade:      "UPDATE users SET (rol) = (b'10') WHERE id = $1 AND activo = TRUE",
userDisable:      "UPDATE users SET (activo) = (FALSE) WHERE id = $1"
}

function readMechs() {
  try {
    return new Promise((resolve) => {
      pool.query(queries.readMechs, (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userCreate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.userDeactivated, [data.correo], (err, result) => {
        if (result.rowCount > 2)
          return resolve({error: "Correo deshabilitado."});
        pool.query(queries.userRead, [data.correo], (err, result) => {
          if (result.rowCount > 0)
            return resolve({error: "Este correo ya está siendo utilizado."});
          pool.query(queries.userCreate, [data.nombre, data.celular, data.correo, data.clave, data.rol], (err, result) => {
            return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows[0]});
          });
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userRead(correo) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.userRead, [correo], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userUpdate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.userDeactivated, [data.correo], (err, result) => {
        if (result.rowCount > 2)
          return resolve({error: "Correo deshabilitado."});
        pool.query(queries.userUpdate, [data.nombre, data.celular, data.correo, data.clave, data.rol, data.id], (err, result) => {
          return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userUpgrade(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.userUpgrade, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userDisable(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.userDisable, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  readMechs,
  userCreate,
  userRead,
  userUpdate,
  userUpgrade,
  userDisable
}