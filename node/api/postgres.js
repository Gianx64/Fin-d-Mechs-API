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

function readUser(correo) {
    return new Promise((resolve) => {
        client.query(`SELECT * FROM users WHERE correo = ${correo}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function create(table, data) {
    return new Promise((resolve) => {
        client.query(`INSERT INTO ${table} SET ?`, data, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function updateWithId(table, data) {
    return new Promise((resolve) => {
        client.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, data.id], (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

function deleteWithId(table, id) {
    return new Promise((resolve) => {
        client.query(`DELETE FROM ${table} WHERE id = ${id}`, (error, result) => {
            return error ? console.log('[DB err]: Code:',error.code, 'Message:', error.message) : resolve(result.rows);
        })
    })
}

export default { readTable, readWithId, readUser, create, updateWithId, deleteWithId }