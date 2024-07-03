import logger from '../utils/logger.js';

export const insertImg = async (req, res) => {
    try {
        // Aquí puedes manejar los archivos cargados
        const files = req.files;

        // Agrega lógica para manejar la inserción de imágenes, e.g., guardarlas en la DB

        logger.info('Imágenes subidas con éxito', { files });
        res.status(200).send({ message: 'Imágenes subidas con éxito', files });
    } catch (error) {
        logger.error('Error al subir las imágenes', { error });
        res.status(500).send({ message: 'Error al subir las imágenes', error });
    }
};
