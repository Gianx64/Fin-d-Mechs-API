import postgres from "../postgres/appointments.js";
import readWithId from "../postgres/pool.js"
import authController from "./auth.js";

const getAppointments = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    let result = null;
    switch (user.rol) {
      case "10":
        result = await postgres.appointmentsReadMech(user.id);
        break;
      case "01":
        result = {error: "Mecánico no autorizado."};
        break;
      case "11":
      case "00":
      default:
        result = await postgres.appointmentsReadUser(user.id);
        break;
    }
    if (result.error)
      if (typeof result.error === "number")
        throw new Error(`Error ${result.error}.`);
      else
        throw new Error(result.error);
    else if (result.data)
      res.status(200).json(result.data);
    else
      res.status(409).json({
        message: "Error obteniendo citas."
      });
  } catch(err) {
    next(err);
  }
}

const postAppointment = async (req, res, next) => {
  try {
    const result = await postgres.appointmentCreate(req.body);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    else if (result.data)
      res.status(201).json(result.data);
  } catch(err) {
    next(err);
  }
}

const patchAppointment = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const appointment = await readWithId("appointments", req.params.appointmentId).data;
    let result;
    if (user.id === appointment.id_usuario || user.id === appointment.id_mech)
      switch (req.params.action) {
        case '0':
          if (appointment.confirmado || appointment.cancelado)
            throw new Error("La cita ya no se puede modificar.");
          else
            result = await postgres.appointmentUpdate(req.body);
          break;
        case '1':
          if (appointment.confirmado || appointment.cancelado)
            throw new Error("La cita ya no se puede modificar.");
          else
            result = await postgres.appointmentCancel(user.id === appointment.id_usuario ? false : true, req.body.id, user.id);
          break;
        case '2':
          if (user.id === appointment.id_mech)
            result = await postgres.appointmentConfirm(req.body.id);
          else
            throw new Error("Solo el mech puede confirmar la cita.");
          break;
        case '3':
          result = await postgres.appointmentCarTake(req.body.id);
          break;
        case '4':
          result = await postgres.appointmentCarDeliver(req.body.id);
          break;
        case '5':
          result = await postgres.appointmentComplete(req.body.id);
          break;
        case '6':
          if (user.id === appointment.id_usuario)
            result = await postgres.appointmentCommentUser(req.body);
          else if (user.id === appointment.id_mech)
            result = await postgres.appointmentCommentMech(req.body);
          break;
        default:
          res.status(409).json({
            message: "Acción no especificada."
          });
      }
    else
      throw new Error("Acceso no autorizado.");
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    else if (result.data)
      res.status(200).json(result.data);
  } catch(err) {
    next(err);
  }
}

export default {
  getAppointments,
  postAppointment,
  patchAppointment
}