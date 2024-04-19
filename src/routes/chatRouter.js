import { Router } from "express";
import {renderChatView} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.get('/', renderChatView);

export default chatRouter;