import { Router } from "express";
import carController from "../controllers/cars.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', carController.readCars);
router.post('/', carController.createCar);
router.put('/', carController.updateCar);
router.patch("/:id", carController.updateCarVIN);
router.delete("/:id", authController.checkAuth, carController.deactivateCar);

export default router;