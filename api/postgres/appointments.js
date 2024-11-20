import { pool } from "./pool.js";

const queries = {
appointmentCreate:      `INSERT INTO appointments (id_usuario, fecha, ciudad, direccion, id_auto, detalles, id_mech, servicio, id_taller)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
appointmentsReadUser:   `SELECT appointments.*, cars.patente, cars.vin, cars.marca, cars.modelo,
                          users.nombre as mech_usuario, users.celular as mech_celular, users.correo as mech_correo
                          FROM appointments LEFT JOIN cars ON appointments.id_auto = cars.id LEFT JOIN users ON appointments.id_mech = users.id
                          WHERE appointments.id_usuario = $1`,
appointmentsReadMech:   `SELECT appointments.*, cars.patente, cars.vin, cars.marca, cars.modelo,
                          users.nombre as user_usuario, users.celular as user_celular, users.correo as user_correo
                          FROM appointments LEFT JOIN cars ON appointments.id_auto = cars.id LEFT JOIN users ON appointments.id_usuario = users.id
                          WHERE appointments.id_mech = $1 OR appointments.id_mech = NULL`,
appointmentsReadWorkshop:       "SELECT * FROM appointments WHERE id_taller = $1",
appointmentsActiveReadWorkshop: "SELECT * FROM appointments WHERE id_taller = $1 AND cancelado = NULL AND completado = NULL",
appointmentUpdate:      `UPDATE appointments SET (actualizado, fecha, ciudad, direccion, id_auto, detalles, id_mech, servicio, id_taller)
                          = (NOW(), $1, $2, $3, $4, $5, $6, $7, $8) WHERE id = $9`,
appointmentCancel:      "UPDATE appointments SET (actualizado, cancelado, canceladopor) = (NOW(), NOW(), $1) WHERE id = $2",
appointmentConfirm:     "UPDATE appointments SET (actualizado, confirmado) = (NOW(), NOW()) WHERE id = $1",
appointmentMechTake:    "UPDATE appointments SET (actualizado, confirmado, id_mech) = (NOW(), NOW(), $1) WHERE id = $2 AND id_mech = NULL",
appointmentCarTake:     "UPDATE appointments SET (actualizado, auto_tomado) = (NOW(), NOW()) WHERE id = $1",
appointmentCarDeliver:  "UPDATE appointments SET (actualizado, auto_devuelto) = (NOW(), NOW()) WHERE id = $1",
appointmentComplete:    "UPDATE appointments SET (actualizado, completado) = (NOW(), NOW()) WHERE id = $1",
appointmentCommentUser: "UPDATE appointments SET (actualizado, usuario_comentario_tiempo, usuario_comentario) = (NOW(), NOW(), $1) WHERE id = $2",
appointmentCommentMech: "UPDATE appointments SET (actualizado, mech_comentario_tiempo, mech_comentario) = (NOW(), NOW(), $1) WHERE id = $2",
};

function appointmentCreate(data) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.appointmentCreate,
        [data.usuario, data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles || null, data.mech, data.servicio || null, data.id_taller || null],
        (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows[0]});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentsReadUser(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.appointmentsReadUser, [id], (err, result) => {
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
      pool.query(queries.appointmentsReadMech, [id], (err, result) => {
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
      pool.query(queries.appointmentsReadWorkshop, [id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentsActiveReadWorkshop(id) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.appointmentsActiveReadWorkshop, [id], (err, result) => {
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
      pool.query(queries.appointmentUpdate,
        [data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller, data.id],
        (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rowCount});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

function appointmentCancel(canceller, appointmentId, userId) {
  try {
    return new Promise((resolve) => {
      pool.query(queries.appointmentCancel, [canceller, appointmentId], (err, appointmentResult) => {
        if (err)
          return resolve({error: parseInt(err.code)});
        else if (appointmentResult.rowCount == 0)
          return resolve({error: "No se pudo marcar la cita como cancelada."});
        pool.query(queries.userClean, [userId], (err, userResult) => {
          if (err)
            return resolve({error: parseInt(err.code)});
          else if (userResult.rowCount == 0)
            return resolve({error: "No se pudo liberar al usuario de la cita."});
          return resolve({data: appointmentResult.rowCount < userResult.rowCount ? userResult.rowCount : appointmentResult.rowCount});
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
      pool.query(queries.appointmentConfirm, [id], (err, result) => {
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
      pool.query(queries.appointmentMechTake, [mechId, appointmentId], (err, result) => {
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
      pool.query(queries.appointmentCarTake, [id], (err, result) => {
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
      pool.query(queries.appointmentCarDeliver, [id], (err, result) => {
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
      pool.query(queries.appointmentComplete, [appointmentId], (err, appointmentResult) => {
        if (err)
          return resolve({error: parseInt(err.code)});
        else if (appointmentResult.rowCount == 0)
          return resolve({error: "No se pudo marcar la cita como completada."});
        pool.query(queries.userClean, [userId], (err, userResult) => {
          if (err)
            return resolve({error: parseInt(err.code)});
          else if (userResult.rowCount == 0)
            return resolve({error: "No se pudo liberar al usuario de la cita."});
          return resolve({data: appointmentResult.rowCount < userResult.rowCount ? userResult.rowCount : appointmentResult.rowCount});
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
      pool.query(queries.appointmentCommentUser, [comment, id], (err, result) => {
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
      pool.query(queries.appointmentCommentMech, [comment, id], (err, result) => {
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
  appointmentsActiveReadWorkshop,
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
