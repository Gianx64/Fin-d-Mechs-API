import postgres from "../postgres.js";
import authController from "./auth.js";

const queries = {
	workshopsReadMech: "SELECT * FROM workshops WHERE id_usuario = $1",
	workshopCreate: "INSERT INTO workshops (id_usuario, ciudad, direccion, detalles) VALUES ($1, $2, $3, $4) RETURNING *",
	workshopUpdate: "UPDATE workshops SET (ciudad, direccion, detalles) = ($1, $2, $3) WHERE id = $4",
	workshopDeactivate: "UPDATE workshops SET (activo) = (FALSE) WHERE id = $1",
	appointmentsReadWorkshop: "SELECT * FROM appointments WHERE id_taller = $1",
	appointmentsActiveReadWorkshop: "SELECT * FROM appointments WHERE id_taller = $1 AND cancelado = NULL AND completado = NULL"
}

const getWorkshops = async (req, res, next) => {
    try {
        const user = authController.decodifyHeader(req.headers.authorization);
        let result = null;
        switch (user.rol) {
            case "10":
                result = await postgres.workshopsReadMech(user.id);
                break;
            case "01":
                result = {error: "Mecánico no autorizado."};
                break;
            case "11":
            case "00":
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
                message: "Error obteniendo talleres."
            });
    } catch(err) {
        next(err);
    }
}

const postWorkshop = async (req, res, next) => {
    try {
        const result = await postgres.workshopCreate(req.body);
        if (result.error)
            throw new Error(`Error ${result.error}.`);
        else if (result.data)
            res.status(201).json(result.data);
    } catch(err) {
        next(err);
    }
}

const getWorkshop = async (req, res, next) => {
    try {
        const result = await postgres.readWithId("workshops", req.params.workshopId);
        if (result.error)
            throw new Error(`Error ${result.error}.`);
        else if (result.data)
            res.status(200).json(result.data);
    } catch(err) {
        next(err);
    }
}

const patchWorkshop = async (req, res, next) => {
    try {
        const appointments = await postgres.appointmentsReadWorkshop(req.params.workshopId).data;
		let result;
		if (appointments.length === 0) {
        	result = await postgres.workshopUpdate(req.body);
			if (result.error)
				throw new Error(`Error ${result.error}.`);
			else if (result.data)
				res.status(200).json(result.data);
		}
        else
            throw new Error("Este taller ya no se puede modificar.");
    } catch(err) {
        next(err);
    }
}

const deactivateWorkshop = async (req, res, next) => {
    try {
        const appointments = await postgres.appointmentsActiveReadWorkshop(req.params.workshopId).data;
		let result;
		if (appointments.length === 0) {
        	result = await postgres.workshopDeactivate(req.body);
			if (result.error)
				throw new Error(`Error ${result.error}.`);
			else if (result.data)
				res.status(200).json(result.data);
		}
        else
            throw new Error("Este taller ya no se puede modificar.");
    } catch(err) {
        next(err);
    }
}

export default {getWorkshops, postWorkshop, getWorkshop, patchWorkshop, deactivateWorkshop}