import { Router } from "express";
import { userModel } from "../models/user.js";
import { getAllUsers } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/',getAllUsers);

export default userRouter;