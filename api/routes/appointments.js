import { Router } from "express";
import appointmentController from "../controllers/appointments.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get("/formdata", appointmentController.getFormData);
router.post('/', authController.checkAuth, appointmentController.createAppointment);
router.get('/', appointmentController.readAppointments);
router.put("/:id", appointmentController.updateAppointment);
router.patch("/:id", appointmentController.flagAppointment);

export default router;