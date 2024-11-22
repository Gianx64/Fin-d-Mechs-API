import pgCars from "../postgres/cars.js";
import authController from "./auth.js";

const getCars = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    let result = null;
    switch (user.rol) {
      case "10":
      case "01":
        result = {error: "Mecánico no autorizado."};
        break;
      case "11":
      case "00":
        result = await pgCars.carsRead(user.id);
        break;
      default:
        result = {error: "Usuario no autorizado."};
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
        message: "Error obteniendo autos."
      });
  } catch(err) {
    next(err);
  }
}

const postCar = async (req, res, next) => {
  try {
    const result = await pgCars.carCreate(req.body);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    else if (result.data)
      res.status(201).json(result.data);
  } catch(err) {
    next(err);
  }
}

const patchCar = async (req, res, next) => {
  try {
    const result = await pgCars.carUpdate(req.body);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    else if (result.data === 1)
      res.status(200).json(result.data);
    else
      throw new Error("Este auto tiene una cita pendiente.");
  } catch(err) {
    next(err);
  }
}

const deactivateCar = async (req, res, next) => {
  try {
    result = await pgCars.carDeactivate(req.params.carId);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    else if (result.data === 1)
      res.status(200).json(result.data);
    else
      throw new Error("Este auto tiene una cita pendiente.");
  } catch(err) {
    next(err);
  }
}

export default {
  getCars,
  postCar,
  patchCar,
  deactivateCar
}