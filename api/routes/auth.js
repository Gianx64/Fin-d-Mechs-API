import { Router } from "express";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.getUserFromToken);
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/admindata", authController.checkAdmin, authController.getAdminData);
router.get("/setmech/:id", authController.setMech);

export default router;