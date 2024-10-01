import pg from 'pg';
import config from '../config.js';

const client = new pg.Client(config.pg);

function conpg() {

    client.connect((err) => {
        if(!err) {
            console.log('[DB suc]: connected.');
        }
    })

    client.on('error', err => {
        console.log('[DB err]:', err.code, err.message);
        setTimeout(conpg, 10000);
    })
}

setTimeout(conpg, 10000);

function readTable(table) {
    return new Promise((resolve) => {
        client.query(`SELECT * FROM ${table}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function readWithId(table, id) {
    return new Promise((resolve) => {
        client.query(`SELECT * FROM ${table} WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function userCreate(data) {
    return new Promise((resolve) => {
        client.query(`INSERT INTO users (usuario, correo, clave, rol) VALUES (${data.usuario}, ${data.correo}, ${data.clave}, ${data.rol})`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function userCreate(correo) {
    return new Promise((resolve) => {
        client.query(`SELECT * FROM users WHERE correo = ${correo}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function userUpdate(data) {
    return new Promise((resolve) => {
        client.query(`UPDATE users SET (usuario, correo, clave) = (${data.usuario}, ${data.correo}, ${data.clave}) WHERE id = ${data.id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function userDisable(id) {
    return new Promise((resolve) => {
        client.query(`UPDATE users SET activo = FALSE WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentCreate(data) {
    return new Promise((resolve) => {
        client.query(`INSERT INTO appointments (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller) VALUES (${data.usuario}, ${data.fecha}, ${data.ciudad}, ${data.direccion}, ${data.auto_marca}, ${data.auto_modelo}, ${data.detalles}, ${data.mech}, ${data.servicio}, ${data.id_taller})`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentsReadUser(id) {
    return new Promise((resolve) => {
        client.query(`SELECT * FROM appointments WHERE usuario = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentsReadMech(id) {
    return new Promise((resolve) => {
        client.query(`SELECT * FROM appointments WHERE mech = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentUpdate(data) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET (usuario, fecha, ciudad, direccion, auto_marca, auto_modelo, detalles, mech, servicio, id_taller, actualizado) = (${data.usuario}, ${data.fecha}, ${data.ciudad}, ${data.direccion}, ${data.auto_marca}, ${data.auto_modelo}, ${data.detalles}, ${data.mech}, ${data.servicio}, ${data.id_taller}, NOW()) WHERE id = ${data.id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentCancel(who, id) {
	const canceller = who? true: false;
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), cancelado = NOW(), canceladopor = ${canceller} WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentConfirm(id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), confirmado = NOW() WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentCarTake(id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), auto_tomado = NOW() WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentCarDeliver(id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), auto_devuelto = NOW() WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentComplete(id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), completado = NOW() WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentCommentUser(comment, id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), usuario_comentario_tiempo = NOW(), usuario_comentario = ${comment} WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function appointmentCommentMech(comment, id) {
    return new Promise((resolve) => {
        client.query(`UPDATE appointments SET actualizado = NOW(), mech_comentario_tiempo = NOW(), mech_comentario = ${comment} WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

export default { readTable, readWithId, userCreate, userCreate, userUpdate, userDisable, appointmentCreate, appointmentsReadUser, appointmentsReadMech, appointmentUpdate, appointmentCancel, appointmentConfirm, appointmentCarTake, appointmentCarDeliver, appointmentComplete, appointmentCommentUser, appointmentCommentMech }