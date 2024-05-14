import { userModel } from "../models/user.js";

// Controlador para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send("Error al consultar users: ", error)
    }
};