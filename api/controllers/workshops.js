import authController from "./auth.js";
import pgWorkshops from "../postgres/workshops.js";
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
    await pgWorkshops.workshopsRead().then(result => {
      if (result.error)
        if (typeof result.error === "number")
          throw new Error(`Error ${result.error}.`);
        else
          throw new Error(result.error);
      res.status(200).json(result.data);
    })
  } catch(err) {
    next(err);
  }
}

const readMechWorkshops = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    switch (user.rol) {
      case "10":
        await pgWorkshops.workshopsReadMech(user.id).then(result => {
          if (result.error)
            if (typeof result.error === "number")
              throw new Error(`Error ${result.error}.`);
            else
              throw new Error(result.error);
          res.status(200).json(result.data);
        });
        break;
      case "01":
        throw new Error("Mecánico no autorizado.");
      case "11":
      case "00":
      default:
        throw new Error("Usuario no autorizado.");
    }
  } catch(err) {
    next(err);
  }
}

const readWorkshopMechs = async (req, res, next) => {
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

const updateWorkshop = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const workshop = await readWithId("workshops", req.body.id).then(result => {
      if (result.data.id_usuario !== user.id)
        throw new Error("Acción no autorizada.");
      if (!result.data.activo)
        throw new Error("Este taller no se puede modificar.");
      return result.data.verificado;
    });
    if (workshop) {
      await pgWorkshops.workshopDeactivate(req.body.id);
      await pgWorkshops.workshopCreate(req.body).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
        res.status(200).json(result.data);
      });
    } else
      await pgWorkshops.workshopUpdate(req.body).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
        res.status(200).json(result.data);
      });
  } catch(err) {
    next(err);
  }
}

//Gives verification to a workshop
const upgradeWorkshop = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    if (user.rol !== "11")
      throw new Error("Acceso no autorizado.");
    await pgWorkshops.workshopUpgrade(user.id, req.body.workshop).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

const deactivateWorkshop = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    await readWithId("workshops", req.body.id).then(result => {
      if (result.data.id_usuario !== user.id)
        throw new Error("Acción no autorizada.");
      if (!result.data.activo)
        throw new Error("Este taller no se puede modificar.");
    });
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
  readMechWorkshops,
  readWorkshopMechs,
  updateWorkshop,
  upgradeWorkshop,
  deactivateWorkshop
}