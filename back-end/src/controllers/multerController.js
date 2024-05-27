import upload from '../config/multer.js';
import logger from '../utils/logger.js';

export const insertImg = (req, res) => {
    try {
        logger.debug(`Uploaded file: ${JSON.stringify(req.file)}`);
        res.status(200).send("Imagen cargada correctamente");
    } catch (e) {
        logger.error(`Error uploading image: ${e}`);
        res.status(500).send("Error al cargar imagen");
    }
};