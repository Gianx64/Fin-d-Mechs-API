import pgAppointments from "../postgres/appointments.js"
import pgCars from "../postgres/cars.js"
import pgWorkshops from "../postgres/workshops.js"
import pgUsers from "../postgres/users.js"
import { readWithId } from "../postgres/pool.js"
import authController from "./auth.js"

//Returns form data list
async function getFormData(req, res, next) {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const cars = await pgCars.carsReadForm(user.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}: cars.`);
      return result.data;
    });
    const mechs = await pgUsers.mechsRead().then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}: mechs.`);
      return result.data;
    });
    const workshops = await pgWorkshops.workshopsRead().then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}: workshops.`);
      return result.data;
    });
    res.status(200).json({
      cars: cars,
      mechs: mechs,
      workshops: workshops
    });
  } catch(err) {
    next(err);
  }
}

//Returns mechs data list from given workshop
async function getWorkshopMechs(req, res, next) {
  try {
    await pgWorkshops.workshopReadMechs(req.params.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

const createAppointment = async (req, res, next) => {
  try {
    await pgAppointments.appointmentCreate(req.body).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(201).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

const readAppointments = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    let result;
    switch (user.rol) {
      case "10":
        result = await pgAppointments.appointmentsReadMech(user.id);
        break;
      case "01":
        result = {error: "Para empezar a aceptar citas debe ser verificado por un administrador."};
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
    res.status(200).json(result.data);
  } catch(err) {
    next(err);
  }
}

const updateAppointment = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const appointment = await readWithId("appointments", req.params.appointmentId).then(result => {
      if (result.data.cancelado)
        throw new Error("La cita ya no se puede modificar.");
      return result.data;
    });
    let result;
    if (user.id === appointment.id_usuario || user.id === appointment.id_mech)
      switch (req.body.action) {
        case '0':
          if (appointment.confirmado)
            throw new Error("La cita ya no se puede modificar.");
          else
            result = await pgAppointments.appointmentUpdate(req.body);
          break;
        case '7':
          if (user.id === appointment.id_usuario)
            result = await pgAppointments.appointmentCommentUser(req.body.comment, appointment.id);
          else if (user.id === appointment.id_mech)
            result = await pgAppointments.appointmentCommentMech(req.body.comment, appointment.id);
          break;
        default:
          return res.status(409).json({
            message: "Acción no especificada."
          });
      }
    else
      throw new Error("Acceso no autorizado.");
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    res.status(200).json(result.data);
  } catch(err) {
    next(err);
  }
}

const flagAppointment = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const appointment = await readWithId("appointments", req.params.appointmentId).then(result => {
      if (result.data.cancelado)
        throw new Error("La cita ya no se puede modificar.");
      return result.data;
    });
    let result;
    if (user.id === appointment.id_usuario || user.id === appointment.id_mech)
      switch (req.body.flag) {
        case '1':
          result = await pgAppointments.appointmentCancel(user.id === appointment.id_usuario ? false : true, appointment.id, appointment.id_auto);
          break;
        case '2':
          result = await pgAppointments.appointmentMechTake(user.id, appointment.id);
          break;
        case '3':
          if (user.id === appointment.id_mech)
            result = await pgAppointments.appointmentConfirm(appointment.id);
          else
            throw new Error("Solo el mech puede confirmar la cita.");
          break;
        case '4':
          result = await pgAppointments.appointmentCarTake(appointment.id);
          break;
        case '5':
          result = await pgAppointments.appointmentCarDeliver(appointment.id);
          break;
        case '6':
          result = await pgAppointments.appointmentComplete(appointment.id);
          break;
        default:
          return res.status(409).json({
            message: "Acción no especificada."
          });
      }
    else
      throw new Error("Acceso no autorizado.");
    if (result.error)
      if (typeof result.error === "number")
        throw new Error(`Error ${result.error}.`);
      else
        throw new Error(result.error);
    res.status(200).json(result.data);
  } catch(err) {
    next(err);
  }
}

export default {
  getFormData,
  getWorkshopMechs,
  createAppointment,
  readAppointments,
  updateAppointment,
  flagAppointment
}