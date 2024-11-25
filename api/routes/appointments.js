import { Router } from "express";
import appointmentController from "../controllers/appointments.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', appointmentController.getAppointments);
router.post('/', authController.checkAuth, appointmentController.postAppointment);
router.get("/formdata", appointmentController.getFormData);
router.get("/workshopmechs/:id", authController.checkAuth, appointmentController.workshopReadMechs);
router.get("/:appointmentId/:flag", appointmentController.flagAppointment);
router.patch("/:appointmentId/:action", appointmentController.patchAppointment);

export default router;