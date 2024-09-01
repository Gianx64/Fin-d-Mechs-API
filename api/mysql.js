import mysql from 'mysql';

const dbconfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'FindMechs',
}
let connection;

function conMysql() {
    connection = mysql.createConnection(dbconfig);

    connection.connect((err) => {
        if(err) {
            console.log('[DB err]: ', err);
            setTimeout(conMysql, 2000);
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