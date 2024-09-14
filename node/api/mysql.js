import mysql from 'mysql2';
import config from '../config.js';

let connection;

function conMysql() {
    connection = mysql.createConnection(config.mysql);

    connection.connect((err) => {
        if(!err) {
            console.log('[DB suc]: connected.');
        }
    })

    connection.on('error', err => {
        if(err.sqlMessage)
            console.log('[DB err]:', err.errno, err.code, err.sqlMessage);
        else 
            console.log('[DB err]:', err.errno, err.code);
        setTimeout(conMysql, 10000);
    })
}

//setTimeout(conMysql, 10000);

function readTable(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function readWithId(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id = ${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function readUser(correo) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users WHERE correo = ${correo}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function create(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function updateWithId(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, data.id], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function deleteWithId(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE id = ${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

export default { readTable, readWithId, readUser, create, updateWithId, deleteWithId }