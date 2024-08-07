import { generateMockProducts } from '../models/mocking.js';
import logger from "../utils/logger.js";

export const getMockProducts = (req, res) => {
    try {
        const mockProducts = generateMockProducts();
        res.status(200).json(mockProducts);
        logger.info('Productos simulados generados correctamente');
    } catch (error) {
        res.status(500).json({ message: "Error al generar productos simulados", error: error.message });
        logger.error('Error al generar productos simulados', { error });
    }
};

export default { getMockProducts };
