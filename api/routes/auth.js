import { Router } from "express";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.getUserFromToken);
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.delete("/:id", authController.signOff);
router.post("/profile", authController.updateUser);
router.get("/admindata", authController.checkAdmin, authController.getAdminData);
router.patch("/setmech", authController.setMech);

export default router;