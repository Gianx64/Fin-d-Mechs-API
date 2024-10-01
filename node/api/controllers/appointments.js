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
        postgres.appointmentCreate(req.body).then(() => {
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
	switch (req.params.action) {
		case '0':
			//TODO: verify if confirmed or cancelled
			try {
				postgres.appointmentUpdate(req.body).then(() => {
					res.status(200).json({
						message: 'Cita actualizada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '1':
			try {
				postgres.appointmentCancel(req.body.id).then(() => {
					res.status(200).json({
						message: 'Cita cancelada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '2':
			//TODO: verify if mech
			try {
				postgres.appointmentConfirm(req.body.id).then(() => {
					res.status(200).json({
						message: 'Cita confirmada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '3':
			try {
				postgres.appointmentCarTake(req.body.id).then(() => {
					res.status(200).json({
						message: 'Cita actualizada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '4':
			try {
				postgres.appointmentCarDeliver(req.body.id).then(() => {
					res.status(200).json({
						message: 'Cita actualizada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '5':
			try {
				postgres.appointmentComplete(req.body.id).then(() => {
					res.status(200).json({
						message: 'Cita actualizada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '6':
			//TODO: verify if user
			try {
				postgres.appointmentCommentUser(req.body).then(() => {
					res.status(200).json({
						message: 'Cita actualizada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		case '7':
			//TODO: verify if mech
			try {
				postgres.appointmentCommentMech(req.body).then(() => {
					res.status(200).json({
						message: 'Cita actualizada exitosamente.'
					});
				})
			} catch(err) {
				next(err);
			}
			break;
		default:
			break;
	}
}

const cancelAppointment = (req, res, next) => {
    try {
        postgres.appointmentCancel(req.params.appointmentId).then(() => {
            res.status(200).json({
                message: 'Cita cancelada exitosamente.'
            });
        })
    } catch(err) {
        next(err);
    }
}

export default {getAppointments, postAppointment, getAppointment, patchAppointment, cancelAppointment}