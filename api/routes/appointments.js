import { Router } from "express";
import appointmentController from "../controllers/appointments.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get("/formdata", appointmentController.getFormData);
router.get("/workshopmechs/:id", authController.checkAuth, appointmentController.getWorkshopMechs);
router.post('/', authController.checkAuth, appointmentController.createAppointment);
router.get('/', appointmentController.readAppointments);
router.put("/:appointmentId", appointmentController.updateAppointment);
router.patch("/:appointmentId", appointmentController.flagAppointment);

export default router;