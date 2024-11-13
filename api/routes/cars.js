import { Router } from "express";
import carController from "../controllers/cars.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.checkAuth, carController.getCars);
router.post('/', authController.checkAuth, carController.postCar);
router.patch("/:carId", authController.checkAuth, carController.patchCar);

export default router;