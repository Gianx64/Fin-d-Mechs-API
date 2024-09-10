import { Router } from 'express';
import mysql from '../mysql.js';

const router = Router();

router.get('/', (req, res, next) => {
    try {
        mysql.readTable('appointments').then((items) => {
            res.status(200).json({
                message: 'Handling GET request for appointments',
                appointments: items
            });
        })
    } catch(err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        mysql.create('appointments', req.body).then(() => {
            res.status(201).json({
                message: 'Cita creada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
});

router.get('/:appointmentId', (req, res, next) => {
    try {
        mysql.readWithId('appointments', req.params.appointmentId).then((items) => {
            res.status(200).json({
                message: 'Cita encontrada.',
                appointment: items[0]
            });
        })
    } catch(err) {
        next(err);
    }
});

router.patch('/:appointmentId', (req, res, next) => {
    try {
        mysql.updateWithId('appointments', req.body).then(() => {
            res.status(200).json({
                message: 'Cita actualizada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
});

router.delete('/:appointmentId', (req, res, next) => {
    try {
        mysql.deleteWithId('appointments', req.params.appointmentId).then(() => {
            res.status(200).json({
                message: 'Cita eliminada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
});

export default router;