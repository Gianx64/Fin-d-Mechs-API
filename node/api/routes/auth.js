import { Router } from "express";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.getUserFromToken);
router.post('/', authController.signUp);
router.get('/signin', authController.signIn);
router.get('/:correo', authController.checkAuth, authController.readUser);

export default router;