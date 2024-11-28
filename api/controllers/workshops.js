import pgWorkshops from "../postgres/workshops.js";
import authController from "./auth.js";
import { readWithId } from "../postgres/pool.js";

const createWorkshop = async (req, res, next) => {
  try {
    await pgWorkshops.workshopCreate(req.body).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(201).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

const readWorkshops = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    let result;
    switch (user.rol) {
      case "10":
        result = await pgWorkshops.workshopsReadMech(user.id);
        break;
      case "01":
        result = {error: "Mecánico no autorizado."};
        break;
      case "11":
      case "00":
      default:
        result = {error: "Usuario no autorizado."};
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

const updateWorkshop = async (req, res, next) => {
  try {
    const appointed = await readWithId("workshops", req.body.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      if (!result.data.activo)
        throw new Error("Este taller no se puede modificar, intente recargar su lista de talleres.");
      return result.data.cita;
    });
    let result;
    if (appointed) {
      await pgWorkshops.workshopDeactivate(req.body.id);
      result = await pgWorkshops.workshopCreate(req.body);
    } else
      result = await pgWorkshops.workshopUpdate(req.body);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    res.status(200).json(result.data);
  } catch(err) {
    next(err);
  }
}

const deactivateWorkshop = async (req, res, next) => {
  try {
    await pgWorkshops.workshopDeactivate(req.params.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      //if (result.data === 1)
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

export default {
  createWorkshop,
  readWorkshops,
  updateWorkshop,
  deactivateWorkshop
}