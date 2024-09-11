import { Router } from "express";
import auth from "../auth.js";
import mysql from "../mysql.js";

const router = Router();

router.get('/', (req, res, next) => {
    //if token get user
});

function checkAuth(req, res, next) {
    auth.decodifyHeader(req);
}

router.get('/signin', signIn);
router.get('/:correo', readUser);
router.post('/', signUp);

async function signIn(req, res, next) {
    try {
        const token = await auth.signIn(req.body.correo, req.body.clave);
        res.status(200).json({'token': token});
    } catch(err) {
        next(err);
    }
}

async function readUser(req, res, next) {
    try {
        const user = await mysql.readUser(req.params.correo);
        res.status(200).json({'user': user})
    } catch(err) {
        next(err);
    }
}

async function signUp(req, res, next) {
    try {
        mysql.create('users', req.body).then(() => {
            res.status(201).json({
                message: 'Usuario creado exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
}

export default router;