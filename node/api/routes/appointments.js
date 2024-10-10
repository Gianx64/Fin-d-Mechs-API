import { Router } from 'express';
import appointmentController from '../controllers/appointments.js';
import authController from "../controllers/auth.js";

const router = Router();

router.get('/', authController.checkAuth, appointmentController.getAppointments);
router.post('/', authController.checkAuth, appointmentController.postAppointment);
router.get('/:appointmentId', authController.checkAuth, appointmentController.getAppointment);
router.patch('/:appointmentId/:action', authController.checkAuth, appointmentController.patchAppointment);

export default router;