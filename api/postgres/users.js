import { pool } from "./pool.js";

export const userQueries = {
userCreate:       "INSERT INTO users (nombre, celular, correo, clave, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
userDeactivated:  "SELECT * FROM users WHERE correo = $1 AND activo = FALSE",
userRead:         "SELECT * FROM users WHERE correo = $1 AND activo = TRUE",
userUpdate:       "UPDATE users SET (nombre, celular, ciudad, direccion) = ($1, $2, $3, $4) WHERE id = $5 AND activo = TRUE",
userUpdateCorreo: "UPDATE users SET (correo, verificado) = ($1, NULL) WHERE id = $2 AND activo = TRUE",
userUpdateClave:  "UPDATE users SET clave = $1 WHERE id = $2 AND activo = TRUE",
userDeactivate:   "UPDATE users SET activo = FALSE WHERE id = $1",
mechsRead:        `SELECT users.id, users.nombre, users.celular, users.correo, users.registrado, users.verificado
                    FROM mechs INNER JOIN users ON mechs.id_mech = users.id WHERE users.activo = TRUE`, // AND verificado <> NULL
mechsNotRead:     "SELECT id, nombre, celular, correo, registrado, verificado FROM users WHERE rol = '01' AND activo = TRUE", // AND verificado <> NULL
mechUpgrade:      "UPDATE users SET rol = b'10' WHERE id = $1 AND activo = TRUE",
adminSetMech:     "INSERT INTO mechs (id_mech, id_admin) VALUES ($1, $2)"
}

function userCreate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.userDeactivated, [data.correo], (err, result) => {
        if (result.rowCount > 2)
          return resolve({error: "Correo deshabilitado."});
        pool.query(userQueries.userRead, [data.correo], (err, result) => {
          if (result.rowCount > 0)
            return resolve({error: "Este correo ya está siendo utilizado."});
          pool.query(userQueries.userCreate, [data.nombre, data.celular, data.correo, data.clave, data.rol], (err, result) => {
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
      pool.query(userQueries.userRead, [correo], (err, result) => {
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
      pool.query(userQueries.userDeactivated, [data.correo], (err, result) => {
        if (result.rowCount > 2)
          return resolve({error: "Correo deshabilitado."});
        pool.query(userQueries.userUpdate, [data.nombre, data.celular, data.ciudad, data.direccion, data.id], (err, result) => {
          return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userUpdateCorreo(correo, id) {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.userDeactivated, [data.correo], (err, result) => {
        if (result.rowCount > 2)
          return resolve({error: "Correo deshabilitado."});
        pool.query(userQueries.userRead, [data.correo], (err, result) => {
          if (result.rowCount > 0)
            return resolve({error: "Este correo ya está siendo utilizado."});
          pool.query(userQueries.userUpdateCorreo, [correo, id], (err, result) => {
            return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
          });
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userUpdateClave(clave, id) {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.userUpdateClave, [clave, id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function userDeactivate(id) {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.userDeactivate, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function mechsRead() {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.mechsRead, (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function mechsNotRead() {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.mechsNotRead, (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function mechUpgrade(mech, admin) {
  try {
    return new Promise((resolve) => {
      pool.query(userQueries.mechUpgrade, [mech], (err, result) => {
        if (err)
          return resolve({error: parseInt(err.code)});
        pool.query(userQueries.adminSetMech, [mech, admin], (err, result) => {
          return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  userQueries,
  userCreate,
  userRead,
  userUpdate,
  userUpdateCorreo,
  userUpdateClave,
  userDeactivate,
  mechsRead,
  mechsNotRead,
  mechUpgrade
}