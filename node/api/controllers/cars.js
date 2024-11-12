import postgres from "../postgres.js";
import authController from "./auth.js";

const queries = {
	carCreate: "INSERT INTO cars (id_usuario, patente, vin, marca, modelo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
	carUpdate: "UPDATE cars SET (patente, vin, marca, modelo) = ($1, $2, $3, $4) WHERE id = $5",
	carDeactivate: "UPDATE cars SET (activo) = (FALSE) WHERE id = $1"
}

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
                result = await postgres.carsRead(user.id);
            default:
                result = {error: "Usuario no autorizado."};
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
                message: "Error obteniendo autos."
            });
    } catch(err) {
        next(err);
    }
}

const postCar = async (req, res, next) => {
    try {
        const result = await postgres.carCreate(req.body);
        if (result.error)
            throw new Error(`Error ${result.error}.`);
        else if (result.data)
            res.status(201).json(result.data);
    } catch(err) {
        next(err);
    }
}

const getCar = async (req, res, next) => {
    try {
        const result = await postgres.readWithId("cars", req.params.carId);
        if (result.error)
            throw new Error(`Error ${result.error}.`);
        else if (result.data)
            res.status(200).json(result.data);
    } catch(err) {
        next(err);
    }
}

const patchCar = async (req, res, next) => {
    try {
        const car = await postgres.readWithId("cars", req.params.carId).data;
		let result;
		if (!car.cita) {
        	result = await postgres.carUpdate(req.body);
			if (result.error)
				throw new Error(`Error ${result.error}.`);
			else if (result.data)
				res.status(200).json(result.data);
		}
        else
            throw new Error("Este auto tiene una cita pendiente.");
    } catch(err) {
        next(err);
    }
}

const deactivateCar = async (req, res, next) => {
    try {
        const car = await postgres.readWithId("cars", req.params.carId).data;
		let result;
		if (!car.cita) {
        	result = await postgres.carDeactivate(req.params.carId);
			if (result.error)
				throw new Error(`Error ${result.error}.`);
			else if (result.data)
				res.status(200).json(result.data);
		}
        else
            throw new Error("Este auto tiene una cita pendiente.");
    } catch(err) {
        next(err);
    }
}

export default {getCars, postCar, getCar, patchCar, deactivateCar}