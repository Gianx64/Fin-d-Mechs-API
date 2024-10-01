import { Router } from 'express';
import appointmentController from '../controllers/appointments.js';

const router = Router();

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.postAppointment);
router.get('/:appointmentId', appointmentController.getAppointment);
router.patch('/:appointmentId/:action', appointmentController.patchAppointment);
router.delete('/:appointmentId', appointmentController.cancelAppointment);

export default router;