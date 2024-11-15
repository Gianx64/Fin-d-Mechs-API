import { hash, compare } from "bcrypt"
import jwt from "jsonwebtoken"
import pgUsers from "../postgres/users.js"

//Middleware to check if authorization token is valid
function checkAuth(req, res, next) {
	try {
		decodifyHeader(req.headers.authorization);
		next();
	} catch(err) {
		next(err);
	}
}

//Authorization token decodifier, returns user data
function getUserFromToken(req, res, next) {
	try {
		const user = decodifyHeader(req.headers.authorization);
		res.status(200).json(user);
	} catch(err) {
		next(err);
	}
}

//Sign in function with email and password, returns authorization token
async function signIn(req, res, next) {
	try {
		if (req.body.correo.indexOf('@') === -1 || req.body.correo.indexOf('.') === -1) {
			res.status(409).json({
				message: "Correo inválido."
			});
		} else {
			let result = await pgUsers.userRead(req.body.correo);
			if (result.error)
				throw new Error(`Error ${result.error}.`);
			else if (result.data.length === 1) {
				const token = await compare(req.body.clave, result.data[0].clave).then(fulfilled => {
					if(fulfilled === true) {
						delete result.data[0]["clave"];
						delete result.data[0]["verificado"];
						delete result.data[0]["activo"];
						return jwt.sign(result.data[0], process.env.JWTSECRET, {expiresIn: "1d"});
					} else return null;
				});
				if (token)
					res.status(200).json({
						...result.data[0],
						token: token
					});
				else
					res.status(401).json({
						message: "Información inválida."
					});
			} else
				res.status(404).json({
					message: "Usuario no encontrado."
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
			nombre: req.body.nombre,
			celular: req.body.celular,
			correo: req.body.correo.toLowerCase(),
			clave: await hash(req.body.clave.toString(), 6),
			rol: req.body.rol ? "01" : "00"
		};
		if (req.body.correo.indexOf('@') === -1 || req.body.correo.indexOf('.') === -1) {
			res.status(409).json({
				message: "Correo inválido."
			});
		} else {
				let result = await pgUsers.userCreate(authData);
				if (result.error) {
					if (typeof result.error === "number")
						throw new Error(`Error ${result.error}.`);
					else
						throw new Error(result.error);
				} else {
					delete result.data["clave"];
					delete result.data["verificado"];
					delete result.data["activo"];
					result.data = { ...result.data, token: jwt.sign(result.data, process.env.JWTSECRET, {expiresIn: "1d"})};
					delete result.data["nombre"];
					delete result.data["celular"];
					delete result.data["correo"];
					res.status(201).json(result.data);
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
		return jwt.verify(bearer.split(' ')[1], process.env.JWTSECRET);
	}
}

export default {
	checkAuth,
	getUserFromToken,
	signIn,
	signUp,
	decodifyHeader
}
