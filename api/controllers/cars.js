import pgCars from "../postgres/cars.js"
import { readWithId } from "../postgres/pool.js"
import authController from "./auth.js"

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
    res.status(201).json(result.data);
  } catch(err) {
    next(err);
  }
}

const patchCar = async (req, res, next) => {
  try {
    const car = (await readWithId("cars", req.body.id)).data;
    let result;
    if (car.cita)
      throw new Error("Este auto no se puede modificar con una cita pendiente.");
    else if (car.citado) {
      await pgCars.carDeactivate(req.body.id);
      result = await pgCars.carCreate(req.body);
    }
    else
      result = await pgCars.carUpdate(req.body);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    res.status(200).json(result.data);
  } catch(err) {
    next(err);
  }
}

const deactivateCar = async (req, res, next) => {
  try {
    const result = await pgCars.carDeactivate(req.params.carId);
    if (result.error)
      throw new Error(`Error ${result.error}.`);
    res.status(200).json(result.data);
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