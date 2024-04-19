import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/sessionController.js";


const sessionRouter = Router();

sessionRouter.get('/login', sessionController.renderLoginPage);
sessionRouter.post('/login', sessionController.login);

sessionRouter.post('/register', sessionController.register);
sessionRouter.get('/register', sessionController.renderRegisterPage);

sessionRouter.get('/github', sessionController.githubAuth);
sessionRouter.get('/github/callback', sessionController.githubAuthCallback);

sessionRouter.get('/current', sessionController.getCurrentUser);

sessionRouter.get('/logout', sessionController.logout);

sessionRouter.get('/testJWT', sessionController.testJWT);

export default sessionRouter;
