import postgres from "../postgres.js";
import authController from "../controllers/auth.js";

const getAppointments = async (req, res, next) => {
    try {
        const user = authController.decodifyHeader(req.headers.authorization);
        let result;
        if (user.rol == "00") {
            result = await postgres.appointmentsReadUser(user.id);
        } else if (user.rol == "10") {
            result = await postgres.appointmentsReadMech(user.id);
        }
        if (result) {
            res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        } else {
            res.status(409).json({
                message: "Error obteniendo citas.",
                data: null
            });
        }
    } catch(err) {
        next(err);
    }
}

const postAppointment = async (req, res, next) => {
    try {
        const result = await postgres.appointmentCreate(req.body);
        if (result) {
            res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        }
    } catch(err) {
        next(err);
    }
}

const getAppointment = async (req, res, next) => {
    try {
        const result = await postgres.readWithId("appointments", req.params.appointmentId);
        if (result) {
            res.status(result.status).json({
                message: result.message,
                data: result.data[0]
            });
        }
    } catch(err) {
        next(err);
    }
}

const patchAppointment = async (req, res, next) => {
    const user = authController.decodifyHeader(req);
    let result;
    switch (req.params.action) {
        case '0':
            if (req.body.confirmado || req.body.cancelado) {
                res.status(409).json({
                    message: "La cita ya no se puede modificar.",
                    data: null
                });
            } else {
                try {
                    result = await postgres.appointmentUpdate(req.body);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
                    }
                } catch(err) {
                    next(err);
                }
            }
            break;
        case '1':
            if (req.body.confirmado || req.body.cancelado) {
                res.status(409).json({
                    message: "La cita ya no se puede modificar.",
                    data: null
                });
            } else {
                try {
                    result = await postgres.appointmentCancel(req.body.id);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
                    }
                } catch(err) {
                    next(err);
                }
            }
            break;
        case '2':
            if (user.rol !== "10") {
                res.status(409).json({
                    message: "Solo el mech puede confirmar una cita.",
                    data: null
                });
            } else {
                try {
                    result = await postgres.appointmentConfirm(req.body.id);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
                    }
                } catch(err) {
                    next(err);
                }
            }
            break;
        case '3':
            try {
                result = await postgres.appointmentCarTake(req.body.id);
                if (result) {
                    res.status(result.status).json({
                        message: result.message,
                        data: result.data
                    });
                }
            } catch(err) {
                next(err);
            }
            break;
        case '4':
            try {
                result = await postgres.appointmentCarDeliver(req.body.id);
                if (result) {
                    res.status(result.status).json({
                        message: result.message,
                        data: result.data
                    });
                }
            } catch(err) {
                next(err);
            }
            break;
        case '5':
            try {
                result = await postgres.appointmentComplete(req.body.id);
                if (result) {
                    res.status(result.status).json({
                        message: result.message,
                        data: result.data
                    });
                }
            } catch(err) {
                next(err);
            }
            break;
        case '6':
            if (user.rol !== "00") {
                res.status(409).json({
                    message: "Solo el usuario puede comentar como usuario.",
                    data: null
                });
            } else {
                try {
                    result = await postgres.appointmentCommentUser(req.body);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
                    }
                } catch(err) {
                    next(err);
                }
            }
            break;
        case '7':
            if (user.rol !== "10") {
                res.status(409).json({
                    message: "Solo el mech puede comentar como mech.",
                    data: null
                });
            } else {
                try {
                    result = await postgres.appointmentCommentMech(req.body);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
                    }
                } catch(err) {
                    next(err);
                }
            }
            break;
        default:
            res.status(409).json({
                message: "Acción no especificada.",
                data: null
            });
            break;
    }
}

export default {getAppointments, postAppointment, getAppointment, patchAppointment}