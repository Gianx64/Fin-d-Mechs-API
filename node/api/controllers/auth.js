import { hash, compare } from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../../config.js"
import postgres from "../postgres.js"

//Middleware to check if authorization token is valid
const checkAuth = (req, res, next) => {
    try {
        decodifyHeader(req.headers.authorization);
        next();
    } catch(err) {
        next(err);
    }
}

//Authorization token decodifier, returns user data
const getUserFromToken = (req, res, next) => {
    try {
        const user = decodifyHeader(req.headers.authorization);
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

//Sign in function with email and password, returns authorization token
async function signIn(req, res, next) {
    try {
        let userResult = await postgres.userRead(req.body.correo);
        if (userResult.status != 200) {
            next(userResult);
        } else if (userResult.data[0]) {
            const token = await compare(req.body.clave, userResult.data[0].clave).then(fulfilled => {
                if(fulfilled === true) {
                    delete userResult.data[0]["clave"];
                    delete userResult.data[0]["activo"];
                    return jwt.sign(userResult.data[0], config.jwt.secret, { expiresIn: "7d" });
                } else { return null; }
            });
            if (token) {
                res.status(userResult.status).json({
                    message: "Token creado exitosamente.",
                    data: { ...userResult.data[0], token: token }
                });
            } else {
                res.status(401).json({
                    message: "Información inválida.",
                    data: null
                });
            }
        } else {
            res.status(404).json({
                message: "Usuario no encontrado.",
                data: null
            });
        }
    } catch(err) {
        next(err);
    }
}

//Register new user, returns user data, including token
async function signUp(req, res, next) {
    //TODO: verificar celular
    try {
        const authData = {
            usuario: req.body.usuario,
            celular: req.body.celular,
            correo: req.body.correo.toLowerCase(),
            clave: await hash(req.body.clave.toString(), 6),
            rol: req.body.rol ? "01" : "00"
        };
        if (req.body.correo.indexOf('@') === -1 || req.body.correo.indexOf('.') === -1) {
            res.status(409).json({
                message: "Correo inválido.",
                data: null
            });
        } else {
                let userResult = await postgres.userCreate(authData);
                if (userResult.status != 201) {
                    next(userResult);
                } else {
                    delete userResult.data["clave"];
                    delete userResult.data["activo"];
                    userResult.data = { ...userResult.data, token: jwt.sign(userResult.data, config.jwt.secret, { expiresIn: "7d" })};
                    delete userResult.data["usuario"];
                    delete userResult.data["celular"];
                    delete userResult.data["correo"];
                    res.status(userResult.status).json({
                        message: userResult.message,
                        data: userResult.data
                    });
                }
        }
    } catch(err) {
        next(err);
    }
}

//Returns user data if token matches database user data
async function readUser(req, res, next) {
    try {
        const decodified = decodifyHeader(req.headers.authorization);
        if (decodified.correo !== req.params.correo) {
            res.status(403).json({
                message: "Acceso denegado.",
                data: null
            });
        } else {
            const userResult = await postgres.userRead(req.params.correo);
            if (userResult.status != 200) {
                next(userResult);
            }
            if (userResult.data.length == 1) {
                res.status(userResult.status).json({
                    message: userResult.message,
                    data: userResult.data[0]
                });
            } else {
                res.status(409).json({
                    message: "Error.",
                    data: null
                });
            }
        }
    } catch(err) {
        next(err);
    }
}

//Decrypts authentication token, returns decripted user data
function decodifyHeader(authorization) {
    const bearer = authorization || '';
    if(!bearer) {
        throw new Error("Token inexistente.");
    } else if(bearer.indexOf("Bearer") === -1) {
        throw new Error("Formato inválido.");
    } else {
        return jwt.verify(bearer.split(' ')[1], config.jwt.secret);
    }
}

export default { checkAuth, getUserFromToken, signIn, signUp, readUser, decodifyHeader }
