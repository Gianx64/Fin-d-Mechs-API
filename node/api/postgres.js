import pg from "pg";
import config from "../config.js";

const client = new pg.Client(config.pg);

function conpg() {

    client.connect((err) => {
        if(!err) {
            console.log("[DB suc]: connected.");
        }
    })

    client.on("error", err => {
        console.log("[DB err]:", err.code, err.message);
        setTimeout(conpg, 10000);
    })
}

conpg();

function readTable(table) {
    return new Promise((resolve) => {
        client.query("SELECT * FROM $1", [table], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Lectura exitosa.", data: resolve(result.rows)};
        })
    })
}

function readWithId(table, id) {
    return new Promise((resolve) => {
        client.query("SELECT * FROM $1 WHERE id = $2", [table, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Lectura exitosa.", data: resolve(result.rows)};
        })
    })
}

function userCreate(data) {
    return new Promise((resolve) => {
        client.query("INSERT INTO users (usuario, celular, correo, clave, rol) VALUES ($1, $2, $3, $4, $5)", [data.usuario, data.celular, data.correo, data.clave, data.rol], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 201, message: "Usuario creado exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function userRead(correo) {
    return new Promise((resolve) => {
        client.query("SELECT * FROM users WHERE correo = $1", [correo], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Lectura exitosa.", data: resolve(result.rows)};
        })
    })
}

function userUpdate(data) {
    return new Promise((resolve) => {
        client.query("UPDATE users SET (usuario, celular, correo, clave, rol) = ($1, $2, $3, $4, $5) WHERE id = $6", [data.usuario, data.celular, data.correo, data.clave, data.rol, data.id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Usuario actualizado exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function userDisable(id) {
    return new Promise((resolve) => {
        client.query("UPDATE users SET activo = FALSE WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Usuario desactivado exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentCreate(data) {
    return new Promise((resolve) => {
        client.query("INSERT INTO appointments (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [data.usuario, data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 201, message: "Cita creada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentsReadUser(id) {
    return new Promise((resolve) => {
        client.query("SELECT * FROM appointments WHERE usuario = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Lectura exitosa.", data: resolve(result.rows)};
        })
    })
}

function appointmentsReadMech(id) {
    return new Promise((resolve) => {
        client.query("SELECT * FROM appointments WHERE mech = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Lectura exitosa.", data: resolve(result.rows)};
        })
    })
}

function appointmentUpdate(data) {
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller, actualizado) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) WHERE id = $11", [data.usuario, data.fecha, data.ciudad, data.direccion, data.auto_marca, data.auto_modelo, data.detalles, data.mech, data.servicio, data.id_taller, data.id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentCancel(who, id) {
	const canceller = who? true: false;
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET actualizado = NOW(), cancelado = NOW(), canceladopor = $1 WHERE id = $2", [canceller, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita cancelada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentConfirm(id) {
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET actualizado = NOW(), confirmado = NOW() WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita confirmada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentCarTake(id) {
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET actualizado = NOW(), auto_tomado = NOW() WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentCarDeliver(id) {
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET actualizado = NOW(), auto_devuelto = NOW() WHERE id = $1", [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentComplete(id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), completado = NOW() WHERE id = $1`, [id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentCommentUser(comment, id) {
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET actualizado = NOW(), usuario_comentario_tiempo = NOW(), usuario_comentario = $1 WHERE id = $2", [comment, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

function appointmentCommentMech(comment, id) {
    return new Promise((resolve) => {
        client.query("UPDATE appointments SET actualizado = NOW(), mech_comentario_tiempo = NOW(), mech_comentario = $1 WHERE id = $2", [comment, id], (error, result) => {
            return error ? { status: 500, message: `Error ${error.code}: ${error.message}`, data: null} : { status: 200, message: "Cita actualizada exitosamente.", data: resolve(result.rowCount)};
        })
    })
}

export default { readTable, readWithId, userCreate, userRead, userUpdate, userDisable, appointmentCreate, appointmentsReadUser, appointmentsReadMech, appointmentUpdate, appointmentCancel, appointmentConfirm, appointmentCarTake, appointmentCarDeliver, appointmentComplete, appointmentCommentUser, appointmentCommentMech }
