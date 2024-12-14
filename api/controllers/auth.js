import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import pgUsers from "../postgres/users.js";
import pgWorkshops from "../postgres/workshops.js";
import { readWithId } from "../postgres/pool.js";

//Authorization token decodifier, returns user data
async function getUserFromToken(req, res, next) {
  try {
    const user = decodifyHeader(req.headers.authorization);
    await readWithId("users", user.id).then(result => {
      if (!result.data.activo) {
        throw new Error("Cuenta desactivada.");
      }
      delete result.data.clave;
      delete result.data.activo;
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

//Register new user, returns user data, including token
async function signUp(req, res, next) {
  try {
    if (req.body.correo.indexOf('@') === -1 || req.body.correo.indexOf('.') === -1)
      return res.status(409).json({
        message: "Correo inválido."
      });
    //TODO: verificar celular
    const authData = {
      //...req.body,
      nombre: req.body.nombre,
      celular: req.body.celular,
      correo: req.body.correo.toLowerCase(),
      clave: await hash(req.body.clave.toString(), 6),
      rol: req.body.rol ? "01" : "00"
    };
    //req.body.correo = req.body.correo.toLowerCase();
    //req.body.rol = req.body.rol ? "01" : "00";
    //req.body.clave = await hash(req.body.clave.toString(), 6);
    await pgUsers.userCreate(authData).then(result => {
      if (result.error) {
        if (typeof result.error === "number")
          throw new Error(`Error ${result.error}.`);
        else
          throw new Error(result.error);
      }
      delete result.data.clave;
      delete result.data.activo;
      result.data = { ...result.data, token: jwt.sign(data, process.env.JWTSECRET, {expiresIn: "1d"})};
      delete result.data.nombre;
      delete result.data.celular;
      delete result.data.correo;
      res.status(201).json(result.data);
    });
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
      let data = await pgUsers.userRead(req.body.correo).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
        return result.data;
      });
      if (data.length === 1) {
        const token = await compare(req.body.clave, data[0].clave).then(fulfilled => {
          if(fulfilled === true) {
            delete data[0]["clave"];
            delete data[0]["verificado"];
            delete data[0]["activo"];
            return jwt.sign(data[0], process.env.JWTSECRET, {expiresIn: "1d"});
          } else return null;
        });
        if (token)
          res.status(200).json({
            ...data[0],
            token: token
          });
        else
          res.status(401).json({
            message: "Información inválida."
          });
      } else //if (data.length > 1) {for (let i = 0; i < data.length; i++) pgUsers.userDeactivate(data[0].id);}
        res.status(404).json({
          message: "Usuario no encontrado."
        });
    }
  } catch(err) {
    next(err);
  }
}

async function signOff(req, res, next) {
  try {
    const user = decodifyHeader(req.headers.authorization);
    if (user.id != req.params.id)
      throw new Error("Acción no autorizada.");
    await pgUsers.userDeactivate(req.params.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = decodifyHeader(req.headers.authorization);
    if (user.correo !== req.body.correo)
      await pgUsers.userUpdateCorreo(req.body.correo, user.id).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
      });
    if (req.body.clave)
      await pgUsers.userUpdateClave(await hash(req.body.clave.toString(), 6), user.id).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
      });
    await pgUsers.userUpdate(req.body).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

//Returns administration panel data
async function getAdminData(req, res, next) {
  try {
    const mechs = await pgUsers.mechsNotRead().then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      return result.data;
    });
    const workshops = await pgWorkshops.workshopsNotRead().then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      return result.data;
    });
    res.status(200).json({
      mechs: mechs,
      workshops: workshops
    });
  } catch(err) {
    next(err);
  }
}

//Gives verification to a mech
async function setMech(req, res, next) {
  try {
    const user = decodifyHeader(req.headers.authorization);
    if (user.rol !== "11")
      throw new Error("Acceso no autorizado.");
    await pgUsers.mechUpgrade(req.body.mech, user.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

//Middleware to check if authorization token is valid
function checkAuth(req, res, next) {
  try {
    decodifyHeader(req.headers.authorization);
    next();
  } catch(err) {
    next(err);
  }
}

//Middleware to check if user is administrator
function checkAdmin(req, res, next) {
  try {
    const user = decodifyHeader(req.headers.authorization);
    if (user.rol !== "11")
      throw new Error("Acceso no autorizado.");
    next();
  } catch(err) {
    next(err);
  }
}

//Decrypts authentication token, returns decripted user data
function decodifyHeader(authorization) {
  try {
    const bearer = authorization || '';
    if(!bearer)
      throw new Error("Token inexistente.");
    else if(bearer.indexOf("Bearer") === -1)
      throw new Error("Formato inválido.");
    return jwt.verify(bearer.split(' ')[1], process.env.JWTSECRET);
  } catch(err) {
    if (err.name === "TokenExpiredError")
      throw new Error("Token expirado, inicie sesión con sus credenciales.");
    throw new Error(err);
  }
}

export default {
  signIn,
  signUp,
  signOff,
  updateUser,
  getAdminData,
  setMech,
  checkAuth,
  checkAdmin,
  getUserFromToken,
  decodifyHeader
}
