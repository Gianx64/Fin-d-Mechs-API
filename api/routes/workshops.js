import { Router } from "express";
import workshopController from "../controllers/workshops.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.checkAuth, workshopController.getWorkshops);
router.post('/', authController.checkAuth, workshopController.postWorkshop);
router.patch("/:workshopId", authController.checkAuth, workshopController.patchWorkshop);

export default router;