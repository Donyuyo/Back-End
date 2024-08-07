import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/sessionController.js";

const sessionRouter = Router();

sessionRouter.get('/login', sessionController.login); 
sessionRouter.post('/login', sessionController.login);
sessionRouter.post('/register', sessionController.register);
sessionRouter.get('/register', sessionController.register); 
sessionRouter.get('/github', sessionController.githubAuth);
sessionRouter.get('/github/callback', sessionController.githubAuthCallback);
sessionRouter.get('/current', sessionController.getCurrentUser);
sessionRouter.get('/logout', sessionController.logout);
sessionRouter.get('/testJWT', sessionController.testJWT);
sessionRouter.post('/sendEmailPassword', sessionController.sendEmailPassword);
sessionRouter.post('/reset-password/:token', sessionController.changePassword);

export default sessionRouter;
