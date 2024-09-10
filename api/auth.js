import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import mysql from './mysql.js'

async function login(correo, clave) {
    try {
        const data = await mysql.readUser('users', correo);
        return compare(clave, data.clave).then(result => {
            if(result === true) {
                return assignToken({...data});
            } else {
                throw new Error('Información inválida.');
            }
        })
    } catch(err) {
        next(err);
    }
}

function assignToken(data) {
    return jwt.sign(data, config.jwt.secret);
}

function verifyToken(data) {
    return jwt.verify(data, config.jwt.secret);
}

function checkToken(data) {
    return jwt.checkToken(data, config.jwt.secret);
}

function decodifyHeader(req) {
    const authorization = req.header.authorization || '';
    if(!authorization) {
        throw new Error('Token inexistente.');
    }
    if(authorization.indexOf('Bearer') === -1) {
        throw new Error('Formato inválido.');
    }
    const token = authorization.replace('Bearer ', '');
    const decodified = jwt.verify(token, config.jwt.secret);
    req.user = decodified;
    if(decodified.id !== req.body.id) {
        throw new Error('Acceso denegado.');
    }
    return decodified;
}

async function create(data) {
    authData = {
        usuario: data.usuario,
        correo: data.correo,
        clave: await hash(data.clave.toString(), 6)
    }
    mysql.create('users', authData);
}

export default { login, assignToken, verifyToken, checkToken, decodifyHeader, create }