import postgres from "../postgres.js";
import authController from "../controllers/auth.js";

const getAppointments = async (req, res, next) => {
    try {
        const user = authController.decodifyHeader(req.headers.authorization);
        let result = null;
        switch (user.rol) {
            case "10":
                result = await postgres.appointmentsReadMech(user.id);
                break;
            case "01":
                result = {status: 409, message: "Mecánico no autorizado.", data: null};
                break;
            case "11":
            case "00":
            default:
                result = await postgres.appointmentsReadUser(user.id);
                break;
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
                data: result.data[0]
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
    try {
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
                    result = await postgres.appointmentUpdate(req.body);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
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
                    result = await postgres.appointmentCancel(req.body.id);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
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
                    result = await postgres.appointmentConfirm(req.body.id);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
                    }
                }
                break;
            case '3':
                result = await postgres.appointmentCarTake(req.body.id);
                if (result) {
                    res.status(result.status).json({
                        message: result.message,
                        data: result.data
                    });
                }
                break;
            case '4':
                result = await postgres.appointmentCarDeliver(req.body.id);
                if (result) {
                    res.status(result.status).json({
                        message: result.message,
                        data: result.data
                    });
                }
                break;
            case '5':
                result = await postgres.appointmentComplete(req.body.id);
                if (result) {
                    res.status(result.status).json({
                        message: result.message,
                        data: result.data
                    });
                }
                break;
            case '6':
                if (user.rol !== "00") {
                    res.status(409).json({
                        message: "Solo el usuario puede comentar como usuario.",
                        data: null
                    });
                } else {
                    result = await postgres.appointmentCommentUser(req.body);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
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
                    result = await postgres.appointmentCommentMech(req.body);
                    if (result) {
                        res.status(result.status).json({
                            message: result.message,
                            data: result.data
                        });
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
    } catch(err) {
        next(err);
    }
}

export default {getAppointments, postAppointment, getAppointment, patchAppointment}