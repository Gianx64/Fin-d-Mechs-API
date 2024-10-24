import pg from "pg";
import config from "../config.js";

const { Pool } = pg;
const pool = new Pool(config.pg);
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    console.log("[DB err]:", err.code, err.message);
    process.exit(-1);
});
const client = pool.connect((err) => {
    if(!err) {
        console.log("[DB suc]: connected.");
    }
})

async function readTable(table) {
    return pool.query("SELECT * FROM $1", [table], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Lectura exitosa.", data: result.rows};
        });
}

async function readWithId(table, id) {
    return pool.query("SELECT * FROM $1 WHERE id = $2", [table, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Lectura exitosa.", data: result.rows};
        });
}

async function userCreate(data) {
    return pool.query("INSERT INTO users (usuario, celular, correo, clave, rol) VALUES ($1, $2, $3, $4, $5)", [data.usuario, data.celular, data.correo, data.clave, data.rol], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 201, message: "Usuario creado exitosamente.", data: result.rowCount};
        });
}

async function userRead(correo) {
    return pool.query("SELECT * FROM users WHERE correo = $1", [correo], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Lectura exitosa.", data: result.rows};
        });
}

async function userUpdate(data) {
    return pool.query("UPDATE users SET (usuario, celular, correo, clave, rol) = ($1, $2, $3, $4, $5) WHERE id = $6", [data.usuario, data.celular, data.correo, data.clave, data.rol, data.id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Usuario actualizado exitosamente.", data: result.rowCount};
        });
}

async function userDisable(id) {
    return pool.query("UPDATE users SET activo = FALSE WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Usuario desactivado exitosamente.", data: result.rowCount};
        });
}

async function appointmentCreate(data) {
    return pool.query("INSERT INTO appointments (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [data.usuario, data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 201, message: "Cita creada exitosamente.", data: result.rowCount};
        });
}

async function appointmentsReadUser(id) {
    return pool.query("SELECT * FROM appointments WHERE usuario = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Lectura exitosa.", data: result.rows};
        });
}

async function appointmentsReadMech(id) {
    return pool.query("SELECT * FROM appointments WHERE mech = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Lectura exitosa.", data: result.rows};
        });
}

async function appointmentUpdate(data) {
    return pool.query("UPDATE appointments SET (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller, actualizado) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) WHERE id = $11", [data.usuario, data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller, data.id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount};
        });
}

async function appointmentCancel(who, id) {
	const canceller = who? true: false;
    return pool.query("UPDATE appointments SET actualizado = NOW(), cancelado = NOW(), canceladopor = $1 WHERE id = $2", [canceller, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita cancelada exitosamente.", data: result.rowCount};
        });
}

async function appointmentConfirm(id) {
    return pool.query("UPDATE appointments SET actualizado = NOW(), confirmado = NOW() WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita confirmada exitosamente.", data: result.rowCount};
        });
}

async function appointmentCarTake(id) {
    return pool.query("UPDATE appointments SET actualizado = NOW(), auto_tomado = NOW() WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount};
        });
}

async function appointmentCarDeliver(id) {
    return pool.query("UPDATE appointments SET actualizado = NOW(), auto_devuelto = NOW() WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount};
        });
}

async function appointmentComplete(id) {
    return pool.query(`UPDATE appointments SET actualizado = NOW(), completado = NOW() WHERE id = $1`, [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount};
        });
}

async function appointmentCommentUser(comment, id) {
    return pool.query("UPDATE appointments SET actualizado = NOW(), usuario_comentario_tiempo = NOW(), usuario_comentario = $1 WHERE id = $2", [comment, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount};
        });
}

async function appointmentCommentMech(comment, id) {
    return pool.query("UPDATE appointments SET actualizado = NOW(), mech_comentario_tiempo = NOW(), mech_comentario = $1 WHERE id = $2", [comment, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.detail}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: result.rowCount};
        });
}

export default { readTable, readWithId, userCreate, userRead, userUpdate, userDisable, appointmentCreate, appointmentsReadUser, appointmentsReadMech, appointmentUpdate, appointmentCancel, appointmentConfirm, appointmentCarTake, appointmentCarDeliver, appointmentComplete, appointmentCommentUser, appointmentCommentMech }
