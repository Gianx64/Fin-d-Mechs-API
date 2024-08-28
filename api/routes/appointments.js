import { Router } from 'express';
const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request for appointments'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST request for appointments'
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