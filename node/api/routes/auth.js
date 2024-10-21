import { Router } from "express";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.getUserFromToken);
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/:correo", authController.checkAuth, authController.readUser);

export default router;