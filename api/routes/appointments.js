import { Router } from "express";
import appointmentController from "../controllers/appointments.js";
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.checkAuth, appointmentController.getAppointments);
router.post('/', authController.checkAuth, appointmentController.postAppointment);
router.get("/formdata", authController.checkAuth, appointmentController.readFormData);
router.get("/workshopmechs/:id", authController.checkAuth, appointmentController.workshopReadMechs);
router.patch("/:appointmentId/:action", authController.checkAuth, appointmentController.patchAppointment);

export default router;