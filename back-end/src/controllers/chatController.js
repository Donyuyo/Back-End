import logger from "../utils/logger.js";

export const renderChatView = (req, res) => {
    try {
        res.render("templates/chat", {});
        logger.debug('Vista de chat renderizada correctamente');
    } catch (error) {
        res.status(500).send("Error al renderizar la vista de chat");
        logger.error('Error al renderizar la vista de chat', { error });
    }
};

const chatController = {
    renderChatView
};

export default chatController;
