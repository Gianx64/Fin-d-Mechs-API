import postgres from "../postgres.js";
import authController from "../controllers/auth.js";

const getAppointments = (req, res, next) => {
    try {
        const result = postgres.readTable("appointments");
        res.status(result.status).json({
            message: result.message,
            data: result.data
        });
    } catch(err) {
        next(err);
    }
}

const postAppointment = (req, res, next) => {
    try {
        const result = postgres.appointmentCreate(req.body);
        res.status(result.status).json({
            message: result.message,
            data: result.data
        });
    } catch(err) {
        next(err);
    }
}

const getAppointment = (req, res, next) => {
    try {
        const result = postgres.readWithId("appointments", req.params.appointmentId);
        res.status(result.status).json({
            message: result.message,
            data: result.data[0]
        });
    } catch(err) {
        next(err);
    }
}

//TODO: mejorar todo
const patchAppointment = (req, res, next) => {
    const user = authController.decodifyHeader(req);
    switch (req.params.action) {
        case '0':
            if (req.body.confirmado || req.body.cancelado)
                throw new Error("La cita ya no se puede modificar.");
            try {
                postgres.appointmentUpdate(req.body).then(() => {
                    res.status(200).json({
                        message: "Cita actualizada exitosamente."
                    });
                })
            } catch(err) {
                next(err);
            }
            break;
        case '1':
            if (req.body.confirmado || req.body.cancelado)
                throw new Error("La cita ya no se puede modificar.");
            try {
                postgres.appointmentCancel(req.body.id).then(() => {
                    res.status(200).json({
                        message: "Cita cancelada exitosamente."
                    });
                })
            } catch(err) {
                next(err);
            }
            break;
        case '2':
            if (user.rol !== "10")
                throw new Error("Solo el mech puede confirmar una cita.");
            try {
                postgres.appointmentConfirm(req.body.id).then(() => {
                    res.status(200).json({
                        message: "Cita confirmada exitosamente."
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
                        message: "Cita actualizada exitosamente."
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
                        message: "Cita actualizada exitosamente."
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
                        message: "Cita actualizada exitosamente."
                    });
                })
            } catch(err) {
                next(err);
            }
            break;
        case '6':
            //TODO: verify if user
            if (user.rol !== "10")
                throw new Error("Solo el usuario puede comentar como usuario.");
            try {
                postgres.appointmentCommentUser(req.body).then(() => {
                    res.status(200).json({
                        message: "Cita actualizada exitosamente."
                    });
                })
            } catch(err) {
                next(err);
            }
            break;
        case '7':
            //TODO: verify if mech
            if (user.rol !== "10")
                throw new Error("Solo el mech puede comentar como mech.");
            try {
                postgres.appointmentCommentMech(req.body).then(() => {
                    res.status(200).json({
                        message: "Cita actualizada exitosamente."
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
                message: "Cita cancelada exitosamente."
            });
        })
    } catch(err) {
        next(err);
    }
}

export default {getAppointments, postAppointment, getAppointment, patchAppointment, cancelAppointment}