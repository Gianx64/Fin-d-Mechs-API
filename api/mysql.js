import mysql from 'mysql';
import config from '../config.js';

let connection;

function conMysql() {
    connection = mysql.createConnection(config.mysql);

    connection.connect((err) => {
        if(err) {
            console.log('[DB err]: ', err);
            setTimeout(conMysql, 5000);
        } else {
            console.log('[DB suc]: connected.');
        }
    })

    connection.on('error', err => {
        console.log('[DB err]: ', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            setTimeout(conMysql, 5000);
            conMysql();
        } else {
            throw err;
        }
    })
}

conMysql();

function readTable(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT FROM ${table}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function readWithId(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT FROM ${table} WHERE id = ${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    })
}

function readUser(correo) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT FROM users WHERE correo = ${correo}`, (error, result) => {
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
        connection.query(`UPDATE INTO ${table} SET ? WHERE ID = ?`, [data, data.id], (error, result) => {
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