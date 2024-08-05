import { userModel } from "../models/user.js";
import logger from "../utils/logger.js";
import { sendEmailChangePassword , sendEmailNotification } from '../utils/nodemailer.js';
import moment from 'moment';

// Controlador para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email rol');
        res.status(200).json(users);
        logger.info('Usuarios obtenidos correctamente');
    } catch (error) {
        res.status(500).json("Error al consultar usuarios: " + error);
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
            return res.status(404).json("Usuario no existe");
        }
        logger.info('Documentos enviados correctamente', { user });
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error al enviar el o los documentos', { error });
        res.status(500).json("Error al mandar el documento: " + error.message);
    }
};

export const imageDocs = async (req, res) =>{
    

}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const cutoffDate = moment().subtract(2, 'days').toDate();

        const inactiveUsers = await userModel.find({ last_connection: { $lt: cutoffDate } });

        await userModel.deleteMany({ last_connection: { $lt: cutoffDate } });

        inactiveUsers.forEach(user => {
            const email = user.email;
            sendEmailNotification(email);
        });

        res.status(200).json({ message: 'Usuarios inactivos eliminados y notificados por correo' });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
};

