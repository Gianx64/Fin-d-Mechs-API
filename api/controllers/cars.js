import pgCars from "../postgres/cars.js";
import { readWithId } from "../postgres/pool.js";
import authController from "./auth.js";

const createCar = async (req, res, next) => {
  try {
    await pgCars.carReadPlate(req.body.patente).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      if (result.data.length > 0)
        throw new Error("Ya hay un auto registrado con esa patente.");
    });
    await pgCars.carReadVIN(req.body.vin).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      if (result.data.length > 0)
        throw new Error("Ya hay un auto registrado con ese VIN.");
    });
    await pgCars.carCreate(req.body).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(201).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

const readCars = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    switch (user.rol) {
      case "10":
      case "01":
        throw new Error("Mecánico no autorizado.");
      case "11":
      case "00":
        await pgCars.carsRead(user.id).then(result => {
          if (result.error)
            if (typeof result.error === "number")
              throw new Error(`Error ${result.error}.`);
            else
              throw new Error(result.error);
          res.status(200).json(result.data);
        });
        break;
      default:
        throw new Error("Usuario no autorizado.");
    }
  } catch(err) {
    next(err);
  }
}

const updateCar = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    const car = await readWithId("cars", req.body.id).then(result => {
      if (result.data.id_usuario !== user.id)
        throw new Error("Acción no autorizada.");
      if (result.data.cita)
        throw new Error("Este auto no se puede modificar con una cita pendiente.");
      if (!result.data.activo)
        throw new Error("Este auto no se puede modificar.");
      return result.data;
    });
    await pgCars.carReadPlate(req.body.patente).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      if (result.data.length > 0)
        if (result.data[0].id !== car.id)
          throw new Error("Ya hay un auto registrado con esa patente.");
    });
    await pgCars.carReadVIN(req.body.vin).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      if (result.data.length > 0)
        if (result.data[0].id !== car.id)
          throw new Error("Ya hay un auto registrado con ese VIN.");
    });
    if (car.citado) {
      await pgCars.carDeactivate(req.body.id);
      await pgCars.carCreate(req.body).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
        res.status(200).json(result.data);
      });
    }
    else
      await pgCars.carUpdate(req.body).then(result => {
        if (result.error)
          throw new Error(`Error ${result.error}.`);
        res.status(200).json(result.data);
      });
  } catch(err) {
    next(err);
  }
}

const updateCarVIN = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    if (user.rol !== "10")
      throw new Error("Acción no autorizada.");
    const car = await readWithId("cars", req.params.id).then(result => {
      if (!result.data.activo)
        throw new Error("Este auto no se puede modificar.");
      return result.data;
    });
    await pgCars.carReadVIN(req.body.vin).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      if (result.data.length > 0)
        if (result.data[0].id !== car.id)
          throw new Error("Ya hay un auto registrado con ese VIN.");
      });
    await pgCars.carUpdateVIN(req.body.vin, req.params.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

const deactivateCar = async (req, res, next) => {
  try {
    const user = authController.decodifyHeader(req.headers.authorization);
    await readWithId("cars", req.body.id).then(result => {
      if (result.data.id_usuario !== user.id)
        throw new Error("Acción no autorizada.");
      if (result.data.cita)
        throw new Error("Este auto no se puede modificar con una cita pendiente.");
      if (!result.data.activo)
        throw new Error("Este auto no se puede modificar.");
    });
    await pgCars.carDeactivate(req.params.id).then(result => {
      if (result.error)
        throw new Error(`Error ${result.error}.`);
      res.status(200).json(result.data);
    });
  } catch(err) {
    next(err);
  }
}

export default {
  createCar,
  readCars,
  updateCar,
  updateCarVIN,
  deactivateCar
}