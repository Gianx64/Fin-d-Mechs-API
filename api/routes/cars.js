import { Router } from "express";
import carController from "../controllers/cars.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', carController.readCars);
router.post('/', authController.checkAuth, carController.createCar);
router.patch("/", authController.checkAuth, carController.updateCar);
router.delete("/:id", authController.checkAuth, carController.deactivateCar);

export default router;