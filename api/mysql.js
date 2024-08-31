import mysql from 'mysql';

const dbconfig = {
    host: process.env.host || '',
    user: process.env.user || 'root',
    password: process.env.password || '',
    database: process.env.database || '',
}
let connection;

function conMysql() {
    connection = mysql.createConnection(dbconfig);

    connection.connect((err) => {
        if(err) {
            console.log('[DB err]: ', err);
            setTimeout(conMysql, 200);
        } else {
            console.log('[DB suc]: connected.');
        }
    })

    connection.on('error', err => {
        console.log('[DB err]: ', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();
        } else {
            throw err;
        }
    })
}

conMysql();

function fetchAll(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT FROM ${table}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}

function fetchOne(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT FROM ${table} WHERE id = ${id}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}

function create(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT FROM ${table}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}

function deleteOne(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE id = ${id}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}

export default { fetchAll, fetchOne, create, deleteOne }