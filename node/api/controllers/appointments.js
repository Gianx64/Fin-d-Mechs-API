import postgres from '../postgres.js';

const getAppointments = (req, res, next) => {
    try {
        postgres.readTable('appointments').then((items) => {
            res.status(200).json({
                message: 'Handling GET request for appointments',
                appointments: items
            });
        })
    } catch(err) {
        next(err);
    }
}

const postAppointment = (req, res, next) => {
    try {
        postgres.create('appointments', req.body).then(() => {
            res.status(201).json({
                message: 'Cita creada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
}

const getAppointment = (req, res, next) => {
    try {
        postgres.readWithId('appointments', req.params.appointmentId).then((items) => {
            res.status(200).json({
                message: 'Cita encontrada.',
                appointment: items[0]
            });
        })
    } catch(err) {
        next(err);
    }
}

const patchAppointment = (req, res, next) => {
    try {
        postgres.updateWithId('appointments', req.body).then(() => {
            res.status(200).json({
                message: 'Cita actualizada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
}

const deleteAppointment = (req, res, next) => {
    try {
        postgres.deleteWithId('appointments', req.params.appointmentId).then(() => {
            res.status(200).json({
                message: 'Cita eliminada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
}

export default {getAppointments, postAppointment, getAppointment, patchAppointment, deleteAppointment}