import pg from "pg";
import config from "../config.js";

const { Pool } = pg;
const pool = new Pool(config.pg);
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    console.log("[DB err]:", err.code, err.message);
    process.exit(-1);
});

async function conpg() {
    pool.connect((err) => {
        if(err) {
            console.log("[DB err]:", err.code, err.message);
            setTimeout(conpg, 10000);
        } else {
            console.log("[DB suc]: connected.");
        }
    });
}

conpg();

function readWithId(table, id) {
    try {
        return new Promise((resolve) => {
            pool.query("SELECT * FROM $1 WHERE id = $2", [table, id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Lectura exitosa.", data: result.rows[0]});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function userCreate(data) {
    try {
        return new Promise((resolve) => {
            pool.query("INSERT INTO users (usuario, celular, correo, clave, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *", [data.usuario, data.celular, data.correo, data.clave, data.rol], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 201, message: "Usuario creado exitosamente.", data: result.rows[0]});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function userRead(correo) {
    try {
        return new Promise((resolve) => {
            pool.query("SELECT * FROM users WHERE correo = $1", [correo], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Lectura exitosa.", data: result.rows});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function userUpdate(data) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE users SET (usuario, celular, correo, clave, rol) = ($1, $2, $3, $4, $5) WHERE id = $6", [data.usuario, data.celular, data.correo, data.clave, data.rol, data.id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Usuario actualizado exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function userDisable(id) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE users SET activo = FALSE WHERE id = $1", [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Usuario desactivado exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentCreate(data) {
    try {
        return new Promise((resolve) => {
            pool.query("INSERT INTO appointments (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id", [data.usuario, data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 201, message: "Cita creada exitosamente.", data: result.rows});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentsReadUser(id) {
    try {
        return new Promise((resolve) => {
            pool.query("SELECT appointments.id, appointments.usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller, ingresado, actualizado, confirmado, cancelado, canceladopor, auto_tomado, auto_devuelto, completado, usuario_comentario, usuario_comentario_tiempo, mech_comentario, mech_comentario_tiempo, users.usuario as mech_usuario, users.celular as mech_celular, users.correo as mech_correo FROM appointments LEFT JOIN users ON appointments.mech = users.id WHERE appointments.usuario = $1", [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Lectura exitosa.", data: result.rows});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentsReadMech(id) {
    try {
        return new Promise((resolve) => {
            pool.query("SELECT appointments.id, appointments.usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller, ingresado, actualizado, confirmado, cancelado, canceladopor, auto_tomado, auto_devuelto, completado, usuario_comentario, usuario_comentario_tiempo, mech_comentario, mech_comentario_tiempo, users.usuario as user_usuario, users.celular as user_celular, users.correo as user_correo FROM appointments LEFT JOIN users ON appointments.user = users.id WHERE appointments.mech = $1", [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Lectura exitosa.", data: result.rows});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentUpdate(data) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET (fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller, actualizado) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) WHERE id = $10", [data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller, data.id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentCancel(who, id) {
	const canceller = who? true: false;
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET actualizado = NOW(), cancelado = NOW(), canceladopor = $1 WHERE id = $2", [canceller, id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita cancelada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentConfirm(id) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET actualizado = NOW(), confirmado = NOW() WHERE id = $1", [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita confirmada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentCarTake(id) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET actualizado = NOW(), auto_tomado = NOW() WHERE id = $1", [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentCarDeliver(id) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET actualizado = NOW(), auto_devuelto = NOW() WHERE id = $1", [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentComplete(id) {
    try {
        return new Promise((resolve) => {
            pool.query(`UPDATE appointments SET actualizado = NOW(), completado = NOW() WHERE id = $1`, [id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentCommentUser(comment, id) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET actualizado = NOW(), usuario_comentario_tiempo = NOW(), usuario_comentario = $1 WHERE id = $2", [comment, id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

function appointmentCommentMech(comment, id) {
    try {
        return new Promise((resolve) => {
            pool.query("UPDATE appointments SET actualizado = NOW(), mech_comentario_tiempo = NOW(), mech_comentario = $1 WHERE id = $2", [comment, id], (error, result) => {
                error ? resolve({ status: 409, message: `Error ${error.code}: ${error.detail}`, data: null}) : resolve({ status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount});
            });
        });
    } catch (error) {
        return { status: 500, message: error, data: null};
    }
};

export default { readWithId, userCreate, userRead, userUpdate, userDisable, appointmentCreate, appointmentsReadUser, appointmentsReadMech, appointmentUpdate, appointmentCancel, appointmentConfirm, appointmentCarTake, appointmentCarDeliver, appointmentComplete, appointmentCommentUser, appointmentCommentMech }
