import { pool } from "./pool.js";
import { carQueries } from "./cars.js"
import { userQueries } from "./users.js"
import { workshopQueries } from "./workshops.js";

const appointmentQueries = {
appointmentCreate:      `INSERT INTO appointments (id_usuario, fecha, ciudad, direccion, id_auto, detalles, id_mech, servicio, id_taller)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
appointmentsReadUser:   `SELECT appointments.*, cars.patente, cars.vin, cars.marca, cars.modelo, workshops.nombre, workshops.direccion as taller_direccion,
                          users.nombre as mech_usuario, users.celular as mech_celular, users.correo as mech_correo
                          FROM appointments LEFT JOIN cars ON appointments.id_auto = cars.id LEFT JOIN users ON appointments.id_mech = users.id
                          LEFT JOIN workshops ON appointments.id_taller = workshops.id WHERE appointments.id_usuario = $1`,
appointmentsReadMech:   `SELECT appointments.*, cars.patente, cars.vin, cars.marca, cars.modelo, workshops.nombre, workshops.direccion as taller_direccion,
                          users.nombre as user_usuario, users.celular as user_celular, users.correo as user_correo
                          FROM appointments LEFT JOIN cars ON appointments.id_auto = cars.id LEFT JOIN users ON appointments.id_usuario = users.id
                          LEFT JOIN workshops ON appointments.id_taller = workshops.id
                          WHERE appointments.id_mech = $1 OR (appointments.id_mech IS NULL AND cancelado IS NULL AND completado IS NULL)`,
appointmentsReadWorkshop:       "SELECT * FROM appointments WHERE id_taller = $1",
appointmentUpdate:      `UPDATE appointments SET (actualizado, fecha, ciudad, direccion, id_auto, detalles, id_mech, servicio, id_taller)
                          = (NOW(), $1, $2, $3, $4, $5, $6, $7, $8) WHERE id = $9`,
appointmentCancel:      "UPDATE appointments SET (actualizado, cancelado, canceladopor) = (NOW(), NOW(), $1) WHERE id = $2",
appointmentConfirm:     "UPDATE appointments SET (actualizado, confirmado) = (NOW(), NOW()) WHERE id = $1",
appointmentMechTake:    "UPDATE appointments SET (actualizado, confirmado, id_mech) = (NOW(), NOW(), $1) WHERE id = $2 AND id_mech IS NULL",
appointmentCarTake:     "UPDATE appointments SET (actualizado, auto_tomado) = (NOW(), NOW()) WHERE id = $1",
appointmentCarDeliver:  "UPDATE appointments SET (actualizado, auto_devuelto) = (NOW(), NOW()) WHERE id = $1",
appointmentComplete:    "UPDATE appointments SET (actualizado, completado) = (NOW(), NOW()) WHERE id = $1",
appointmentCommentUser: "UPDATE appointments SET (actualizado, usuario_comentario_tiempo, usuario_comentario) = (NOW(), NOW(), $1) WHERE id = $2",
appointmentCommentMech: "UPDATE appointments SET (actualizado, mech_comentario_tiempo, mech_comentario) = (NOW(), NOW(), $1) WHERE id = $2",
};

function appointmentCreate(data) {
  try {
    return new Promise((resolve) => {
      pool.query("BEGIN", () => {
        pool.query(appointmentQueries.appointmentCreate,
          [data.id_usuario, data.fecha, data.ciudad, data.direccion, data.id_auto, data.detalles || null, data.id_mech, data.servicio || null, data.id_taller || null],
          (err, appointmentResult) => {
            if (err){
              pool.query("ROLLBACK");
              return resolve({error: parseInt(err.code)});
            }
            pool.query(carQueries.carAppointed, [data.id_auto], (err, carResult) => {
              if (err){
                pool.query("ROLLBACK");
                return resolve({error: parseInt(err.code)});
              }
              pool.query(workshopQueries.workshopAppointed, [data.id_taller], (err, workshopResult) => {
                if (err){
                  pool.query("ROLLBACK");
                  return resolve({error: parseInt(err.code)});
                }
                pool.query("COMMIT");
                return resolve({data: appointmentResult.rows[0]});
              });
            });
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentsReadUser(id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentsReadUser, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentsReadMech(id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentsReadMech, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentsReadWorkshop(id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentsReadWorkshop, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentUpdate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentUpdate,
        [data.fecha, data.ciudad, data.direccion, data.id_auto, data.detalles || null, data.id_mech, data.servicio || null, data.id_taller || null, data.id],
        (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentCancel(canceller, appointmentId, carId) {
  try {
    return new Promise((resolve) => {
      pool.query("BEGIN", () => {
        pool.query(appointmentQueries.appointmentCancel, [canceller, appointmentId], (err, appointmentResult) => {
          if (err) {
            pool.query("ROLLBACK");
            return resolve({error: parseInt(err.code)});
          }
          else if (appointmentResult.rowCount == 0) {
            pool.query("ROLLBACK");
            return resolve({error: "No se pudo marcar la cita como cancelada."});
          }
          pool.query(carQueries.carClean, [carId], (err, carResult) => {
            if (err) {
              pool.query("ROLLBACK");
              return resolve({error: parseInt(err.code)});
            }
            else if (carResult.rowCount == 0) {
              pool.query("ROLLBACK");
              return resolve({error: "No se pudo liberar al vehículo de la cita."});
            }
            pool.query("COMMIT");
            return resolve({data: appointmentResult.rowCount < carResult.rowCount ? carResult.rowCount : appointmentResult.rowCount});
          });
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentConfirm(id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentConfirm, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentMechTake(mechId, appointmentId) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentMechTake, [mechId, appointmentId], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentCarTake(id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentCarTake, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentCarDeliver(id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentCarDeliver, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentComplete(appointmentId, userId) {
  try {
    return new Promise((resolve) => {
      pool.query("BEGIN", () => {
        pool.query(appointmentQueries.appointmentComplete, [appointmentId], (err, appointmentResult) => {
          if (err) {
            pool.query("ROLLBACK");
            return resolve({error: parseInt(err.code)});
          }
          else if (appointmentResult.rowCount == 0) {
            pool.query("ROLLBACK");
            return resolve({error: "No se pudo marcar la cita como completada."});
          }
          pool.query(userQueries.userClean, [userId], (err, userResult) => {
            if (err) {
              pool.query("ROLLBACK");
              return resolve({error: parseInt(err.code)});
            }
            else if (userResult.rowCount == 0) {
              pool.query("ROLLBACK");
              return resolve({error: "No se pudo liberar al usuario de la cita."});
            }
            pool.query("COMMIT");
            return resolve({data: appointmentResult.rowCount < userResult.rowCount ? userResult.rowCount : appointmentResult.rowCount});
          });
        });
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentCommentUser(comment, id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentCommentUser, [comment, id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentCommentMech(comment, id) {
  try {
    return new Promise((resolve) => {
      pool.query(appointmentQueries.appointmentCommentMech, [comment, id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  appointmentCreate,
  appointmentsReadUser,
  appointmentsReadMech,
  appointmentsReadWorkshop,
  appointmentUpdate,
  appointmentCancel,
  appointmentConfirm,
  appointmentMechTake,
  appointmentCarTake,
  appointmentCarDeliver,
  appointmentComplete,
  appointmentCommentUser,
  appointmentCommentMech
}
