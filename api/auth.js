import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
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
    return sign(data, config.jwt.secret);
}

async function create(data) {
    authData = {
        usuario: data.usuario,
        correo: data.correo,
        clave: await hash(data.clave.toString(), 6)
    }
    mysql.create('users', authData);
}

export default { login, assignToken, create }