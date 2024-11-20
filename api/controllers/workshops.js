import pgWorkshops from "../postgres/workshops.js";
import pgAppointments from "../postgres/appointments.js";
import authController from "./auth.js";

const getWorkshops = async (req, res, next) => {
	try {
		const user = authController.decodifyHeader(req.headers.authorization);
		let result = null;
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
		const result = await pgWorkshops.workshopCreate(req.body);
		if (result.error)
			throw new Error(`Error ${result.error}.`);
		else if (result.data)
			res.status(201).json(result.data);
	} catch(err) {
		next(err);
	}
}

const patchWorkshop = async (req, res, next) => {
	try {
		const appointments = await pgAppointments.appointmentsReadWorkshop(req.params.workshopId).data;
		let result;
		if (appointments.length === 0) {
			result = await pgWorkshops.workshopUpdate(req.body);
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
		const appointments = await pgAppointments.appointmentsActiveReadWorkshop(req.params.workshopId).data;
		let result;
		if (appointments.length === 0) {
			result = await pgWorkshops.workshopDeactivate(req.body);
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

export default {
	getWorkshops,
	postWorkshop,
	patchWorkshop,
	deactivateWorkshop
}