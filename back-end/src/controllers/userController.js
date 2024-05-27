import { userModel } from "../models/user.js";
import logger from "../utils/logger.js";

// Controlador para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
        logger.info('Usuarios obtenidos correctamente');
    } catch (error) {
        res.status(500).send("Error al consultar users: " + error);
        logger.error('Error al obtener usuarios', { error });
    }
};
