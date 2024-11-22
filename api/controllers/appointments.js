import pgAppointments from "../postgres/appointments.js";
import pgCars from "../postgres/cars.js";
import pgWorkshops from "../postgres/workshops.js";
import pgUsers from "../postgres/users.js";
import readWithId from "../postgres/pool.js"
import authController from "./auth.js";

//Returns form data list
async function readFormData(req, res, next) {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const cars = await pgCars.carsRead(user.id);
    const mechs = await pgUsers.readMechs();
    const workshops = await pgWorkshops.workshopsRead();
    if (cars.error)
      throw new Error(`Error ${cars.error}.`);
    if (mechs.error)
      throw new Error(`Error ${mechs.error}.`);
    if (workshops.error)
      throw new Error(`Error ${workshops.error}.`);
    else
      res.status(200).json({
        cars: cars.data,
        mechs: mechs.data,
        workshops: workshops.data
      });
  } catch(err) {
    next(err);
  }
}

//Returns mechs data list from given workshop
async function workshopReadMechs(req, res, next) {
  try {
    const mechs = await pgWorkshops.workshopReadMechs(req.params.id);
    if (mechs.error)
      throw new Error(`Error ${mechs.error}.`);
    else
      res.status(200).json(mechs.data);
  } catch(err) {
    next(err);
  }
}

const getAppointments = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    let result = null;
    switch (user.rol) {
      case "10":
        result = await pgAppointments.appointmentsReadMech(user.id);
        break;
      case "01":
        result = {error: "Mecánico no autorizado."};
        break;
      case "11":
      case "00":
      default:
        result = await pgAppointments.appointmentsReadUser(user.id);
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
    const result = await pgAppointments.appointmentCreate(req.body);
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
            result = await pgAppointments.appointmentUpdate(req.body);
          break;
        case '1':
          if (appointment.confirmado || appointment.cancelado)
            throw new Error("La cita ya no se puede modificar.");
          else
            result = await pgAppointments.appointmentCancel(user.id === appointment.id_usuario ? false : true, req.body.id, user.id);
          break;
        case '2':
          result = await pgAppointments.appointmentMechTake(user.id, req.body.id);
          break;
        case '3':
          if (user.id === appointment.id_mech)
            result = await pgAppointments.appointmentConfirm(req.body.id);
          else
            throw new Error("Solo el mech puede confirmar la cita.");
          break;
        case '4':
          result = await pgAppointments.appointmentCarTake(req.body.id);
          break;
        case '5':
          result = await pgAppointments.appointmentCarDeliver(req.body.id);
          break;
        case '6':
          result = await pgAppointments.appointmentComplete(req.body.id);
          break;
        case '7':
          if (user.id === appointment.id_usuario)
            result = await pgAppointments.appointmentCommentUser(req.body);
          else if (user.id === appointment.id_mech)
            result = await pgAppointments.appointmentCommentMech(req.body);
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
  readFormData,
  workshopReadMechs,
  getAppointments,
  postAppointment,
  patchAppointment
}