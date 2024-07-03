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

export const sendDocuments = async (req, res) => {
    logger.info('Iniciando el envío de documentos', { params: req.params, body: req.body });
    try {
        const { uid } = req.params;
        const newDocs = req.body;
        
        logger.debug('Buscando usuario con UID:', uid);
        const user = await userModel.findByIdAndUpdate(uid, { $push: { documents: { $each: newDocs } } }, { new: true });
        if (!user) {
            logger.warn('Usuario no encontrado', { uid });
            return res.status(404).send("Usuario no existe");
        }
        logger.info('Documentos enviados correctamente', { user });
        res.status(200).send(user);
    } catch (error) {
        logger.error('Error al enviar el o los documentos', { error });
        res.status(500).send("Error al mandar el documento: " + error.message);
    }
};

export const imageDocs = async (req, res) =>{
    

}



