import { Router } from "express";
import { userModel } from "../models/user.js";
import { getAllUsers, sendDocuments, imageDocs } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/',getAllUsers);
userRouter.post('/:uid/documents', sendDocuments);


export default userRouter;