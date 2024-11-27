import { pool } from "./pool.js";

export const userQueries = {
userCreate:       "INSERT INTO users (nombre, celular, correo, clave, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
userDeactivated:  "SELECT * FROM users WHERE correo = $1 AND activo = FALSE",
userRead:         "SELECT * FROM users WHERE correo = $1 AND activo = TRUE",
userUpdate:       "UPDATE users SET (nombre, celular, correo, clave, rol) = ($1, $2, $3, $4, $5) WHERE id = $6 AND activo = TRUE",
userDeactivate:   "UPDATE users SET activo = FALSE WHERE id = $1",
mechsRead:        "SELECT id, nombre, celular, correo, registrado, verificado FROM users WHERE rol = '10' AND activo = TRUE", // AND verificado <> NULL
mechsNotRead:     "SELECT id, nombre, celular, correo, registrado, verificado FROM users WHERE rol = '01' AND activo = TRUE", // AND verificado <> NULL
mechUpgrade:      "UPDATE users SET rol = b'10' WHERE id = $1 AND activo = TRUE",
adminSetMech:     "INSERT INTO mechs (mech, verificadopor) VALUES ($1, $2)"
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
        pool.query(userQueries.userUpdate, [data.nombre, data.celular, data.correo, data.clave, data.rol, data.id], (err, result) => {
          return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
        });
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
  userDeactivate,
  mechsRead,
  mechsNotRead,
  mechUpgrade
}