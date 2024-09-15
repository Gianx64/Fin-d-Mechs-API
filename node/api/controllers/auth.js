import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config.js'
import postgres from '../postgres.js'

const checkAuth = (req, res, next) => {
    decodifyHeader(req);
}

const getUserFromToken = (req, res, next) => {
    const user = decodifyHeader(req)
    res.status(200).json(user);
}

const signIn = (req, res, next) => {
    try {
        const data = postgres.readUser('users', req.body.correo);
        const token = compare(req.body.clave, data.clave).then(result => {
            if(result === true) {
                return jwt.sign(...data, config.jwt.secret);
            } else {
                throw new Error('Información inválida.');
            }
        })
        res.status(200).json({'token': token});
    } catch(err) {
        next(err);
    }
}

async function signUp(req, res, next) {
    try {
        postgres.create('users', req.body).then(() => {
            res.status(201).json({
                message: 'Usuario creado exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
}

async function readUser(req, res, next) {
    try {
        const user = await postgres.readUser(req.params.correo);
        res.status(200).json({'user': user})
    } catch(err) {
        next(err);
    }
}

function decodifyHeader(req) {
    const authorization = req.header.authorization || '';
    if(!authorization)
        throw new Error('Token inexistente.');
    if(authorization.indexOf('Bearer') === -1)
        throw new Error('Formato inválido.');
    const token = authorization.split(' ')[1];
    const decodified = jwt.verify(token, config.jwt.secret);
    req.user = decodified;
    if(decodified.id !== req.body.id)
        throw new Error('Acceso denegado.');
    return decodified;
}

async function create(data) {
    authData = {
        usuario: data.usuario,
        correo: data.correo,
        clave: await hash(data.clave.toString(), 6)
    }
    postgres.create('users', authData);
}

export default { checkAuth, getUserFromToken, signIn, signUp, readUser, decodifyHeader, create }