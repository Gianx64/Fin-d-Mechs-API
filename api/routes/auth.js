import { Router } from "express";
import auth from "../auth";

const router = Router();

router.get('/', (req, res, next) => {
    //if token get user
});

router.get('/login', login);

async function login(req, res, next) {
    try {
        const token = await auth.login(req.body.correo, req.body.clave);
        res.status(200).json({'token': token});
    } catch(err) {
        next(err);
    }
}

export default router;