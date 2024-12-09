import { Router } from "express";
import carController from "../controllers/cars.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', carController.readCars);
router.post('/', authController.checkAuth, carController.createCar);
router.put('/', carController.updateCar);
router.patch("/:id", carController.updateCarVIN);
router.delete("/:id", carController.deactivateCar);

export default router;