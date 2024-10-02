import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config.js'
import postgres from '../postgres.js'

const checkAuth = (req, res, next) => {
    decodifyHeader(req);
    next();
}

const getUserFromToken = (req, res, next) => {
    const user = decodifyHeader(req);
    res.status(200).json(user);
}

async function signIn(req, res, next) {
    try {
        const data = await postgres.userRead(req.body.correo);
        const token = await compare(req.body.clave, data.clave).then(result => {
            if(result === true) {
                return jwt.sign(data, config.jwt.secret, {expiresIn: '7d'});
            } else {
                throw new Error('Información inválida.');
            }
        })
        console.log("token generado: "+token);
        res.status(200).json({'token': token});
    } catch(err) {
        next(err);
    }
}

async function signUp(req, res, next) {
    const authData = {
        usuario: req.body.usuario,
        celular: req.body.celular,
        correo: req.body.correo,
        clave: await hash(req.body.clave.toString(), 6),
        rol: req.body.rol
    }
    try {
        postgres.userCreate(authData).then(() => {
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
        const user = await postgres.userRead(req.params.correo);
        res.status(200).json({'user': user})
    } catch(err) {
        next(err);
    }
}

function decodifyHeader(req) {
    const authorization = req.headers.authorization || '';
    if(!authorization)
        throw new Error('Token inexistente.');
    if(authorization.indexOf('Bearer') === -1)
        throw new Error('Formato inválido.');
    const token = authorization.split(' ')[1];
    return jwt.verify(token, config.jwt.secret);
}

export default { checkAuth, getUserFromToken, signIn, signUp, readUser, decodifyHeader }
