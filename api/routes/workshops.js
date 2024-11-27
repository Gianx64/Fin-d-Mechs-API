import { Router } from "express";
import workshopController from "../controllers/workshops.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', workshopController.readWorkshops);
router.post('/', authController.checkAuth, workshopController.createWorkshop);
router.patch("/", authController.checkAuth, workshopController.updateWorkshop);
router.delete("/:workshopId", authController.checkAuth, workshopController.deactivateWorkshop);

export default router;