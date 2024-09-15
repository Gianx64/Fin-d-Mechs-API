import { Router } from 'express';
import appointmentController from '../controllers/appointments.js';

const router = Router();

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.postAppointment);
router.get('/:appointmentId', appointmentController.getAppointment);
router.patch('/:appointmentId', appointmentController.patchAppointment);
router.delete('/:appointmentId', appointmentController.deleteAppointment);

export default router;