import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config.js'
import postgres from '../postgres.js'

const checkAuth = (req, res, next) => {
    decodifyHeader(req);
    next();
}

const getUserFromToken = (req, res, next) => {
    let user = decodifyHeader(req);
    delete user['clave'];
    delete user['activo'];
    res.status(200).json(user);
}

async function signIn(req, res, next) {
    try {
        const data = await postgres.userRead(req.body.correo);
        if(!data) {
            return res.status(404).json({message: 'Usuario no encontrado.'});
        }
        const token = await compare(req.body.clave, data.clave).then(result => {
            if(result === true) {
                return jwt.sign(data, config.jwt.secret, {expiresIn: '7d'});
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
    const authData = {
        usuario: req.body.usuario,
        celular: req.body.celular,
        correo: req.body.correo,
        clave: await hash(req.body.clave.toString(), 6),
        rol: req.body.rol ? "01" : "00"
    }
    try {
        postgres.userCreate(authData).then((result) => {
            console.log("User created: "+result);
            delete authData['clave'];
            res.status(201).json({
                message: 'Usuario creado exitosamente.',
                user: authData
            });
        })
    } catch(err) {
        next(err);
    }
}

async function readUser(req, res, next) {
    try {
        const decodified = decodifyHeader(req);
        if (decodified.correo !== req.params.correo)
            throw new Error('Acceso denegado.');
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
