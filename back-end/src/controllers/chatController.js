export const renderChatView = (req, res) => {
    res.render("templates/chat", {});
};

const chatController = {
    renderChatView
};

export default chatController;
