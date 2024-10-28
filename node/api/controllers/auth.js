import { hash, compare } from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../../config.js"
import postgres from "../postgres.js"

const checkAuth = (req, res, next) => {
    try {
        decodifyHeader(req);
        next();
    } catch(err) {
        next(err);
    }
}

const getUserFromToken = (req, res, next) => {
    try {
        const user = decodifyHeader(req);
        res.status(200).json({
            message: "Decodificación exitosa.",
            data: user
        });
    } catch(error) {
        res.status(409).json({
            message: error.message,
            data: null
        });
    }
}

async function signIn(req, res, next) {
    try {
        let result = await postgres.userRead(req.body.correo);
        if (result.status == 409) {
            return res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        }
        if (result.data.length == 0) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
                data: null
            });
        }
        const token = await compare(req.body.clave, result.data.clave).then(result => {
            if(result === true) {
                delete result.data["clave"];
                delete result.data["activo"];
                return jwt.sign(result.data, config.jwt.secret, { expiresIn: "7d" });
            } else { return null; }
        });
        if (token) {
            res.status(result.status).json({
                message: "Token creado exitosamente.",
                data: token
            });
        } else {
            res.status(401).json({
                message: "Información inválida.",
                data: null
            });
        }
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
    };
    try {
        const result = await postgres.userCreate(authData);
        res.status(result.status).json({
            message: result.message,
            data: result.data
        });
    } catch(err) {
        next(err);
    }
}

async function readUser(req, res, next) {
    try {
        const decodified = decodifyHeader(req);
        if (decodified.correo !== req.params.correo)
            return res.status(403).json({
                message: "Acceso denegado.",
                data: null
            });
        const result = await postgres.userRead(req.params.correo);
        if (result.data.length == 1) {
            res.status(result.status).json({
                message: result.message,
                data: result.data[0]
            });
        } else {
            res.status(409).json({
                message: "Error.",
                data: null
            });
        }
    } catch(err) {
        next(err);
    }
}

function decodifyHeader(req) {
    const authorization = req.headers.authorization || '';
    if(!authorization)
        return res.status(511).json({
            message: "Token inexistente.",
            data: null
        });
    if(authorization.indexOf("Bearer") === -1)
        return res.status(511).json({
            message: "Formato inválido.",
            data: null
        });
    const token = authorization.split(' ')[1];
    return jwt.verify(token, config.jwt.secret);
}

export default { checkAuth, getUserFromToken, signIn, signUp, readUser, decodifyHeader }
