import { Router } from 'express';
import fetchAll from '../mysql.js';
const router = Router();

router.get('/', (req, res, next) => {
    const appointments = fetchAll('appointments').then((items) => {
        res.status(200).json({
            message: 'Handling GET request for appointments',
            appointments: appointments
        });
    })
});

router.post('/', (req, res, next) => {
    const appointment = {
        user: req.body.user,
        date: req.body.date,
        city: req.body.city,
        address: req.body.address,
        car_make: req.body.car_make,
        car_model: req.body.car_model,
        description: req.body.description,
        service: req.body.service,
        workshop_id: req.body.workshop_id,
        mech: req.body.mech
    }
    res.status(201).json({
        message: 'Handling POST request for appointments',
        appointment: appointment
    });
});

router.get('/:appointmentId', (req, res, next) => {
    const id = req.params.appointmentId;
    res.status(200).json({
        message: 'Handling GET request for appointments',
        id: id
    });
});

router.patch('/:appointmentId', (req, res, next) => {
    const id = req.params.appointmentId;
    res.status(200).json({
        message: 'Handling PATCH request for appointments',
        id: id
    });
});

router.delete('/:appointmentId', (req, res, next) => {
    const id = req.params.appointmentId;
    res.status(200).json({
        message: 'Handling DELETE request for appointments',
        id: id
    });
});

export default router;