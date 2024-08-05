import logger from "../utils/logger.js";

export const renderChatView = (req, res) => {
    try {
        res.json({ message: "Vista de chat renderizada correctamente" });
        logger.debug('Vista de chat renderizada correctamente');
    } catch (error) {
        res.status(500).json({ message: "Error al renderizar la vista de chat", error: error.message });
        logger.error('Error al renderizar la vista de chat', { error });
    }
};

const chatController = {
    renderChatView
};

export default chatController;
