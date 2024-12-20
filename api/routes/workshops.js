import { Router } from "express";
import workshopController from "../controllers/workshops.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.checkAuth, workshopController.readWorkshops);
router.get("/mech", workshopController.readMechWorkshops);
router.get("/:id/mechs", authController.checkAuth, workshopController.readWorkshopMechs);
router.post('/', authController.checkAuth, workshopController.createWorkshop);
router.put('/', workshopController.updateWorkshop);
router.patch("/upgrade", workshopController.upgradeWorkshop);
router.delete("/:id", workshopController.deactivateWorkshop);

export default router;