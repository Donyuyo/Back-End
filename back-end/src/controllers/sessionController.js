import passport from "passport";
import logger from "../utils/logger.js"; 
import { sendEmailChangePassword } from "../utils/nodemailer.js";
import jwt from 'jsonwebtoken';
import { userModel } from "../models/user.js"
import varenv from "../dotenv.js";
import {validatePassword, createHash} from '../utils/bcrypt.js'

const renderLoginPage = async (req, res) => {
    res.render('templates/login');
    logger.info('Rendered login page');
};

const login = async (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        try {
            if (err || !user) {
                logger.warn('Failed login attempt', { error: err, user });
                return res.status(401).send("Usuario o contraseña no válidos");
            }
            req.login(user, (err) => {
                if (err) {
                    logger.error('Error during user login', { error: err });
                    return next(err);
                }
                req.session.user = {
                    email: req.user.email,
                    first_name: req.user.first_name
                };
                logger.info('User logged in', { user: req.session.user });
                return res.status(200).send("Usuario logueado correctamente");
            });
        } catch (err) {
            logger.error('Unexpected error during login', { error: err });
            return next(err);
        }
    })(req, res, next);
};

const register = async (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        try {
            if (err || !user) {
                logger.warn('Failed registration attempt', { error: err, user });
                return res.status(400).send("Usuario ya existente en la aplicación");
            }
            req.login(user, (err) => {
                if (err) {
                    logger.error('Error during user registration', { error: err });
                    return next(err);
                }
                logger.info('User registered successfully', { user });
                return res.status(200).send("Usuario creado correctamente");
            });
        } catch (err) {
            logger.error('Unexpected error during registration', { error: err });
            return next(err);
        }
    })(req, res, next);
};

const renderRegisterPage = async (req, res) => {
    res.render('templates/register');
    logger.info('Rendered register page');
};

const githubAuth = async (req,res)=>{
    passport.authenticate('github', { scope: ['user:email'] });
};



const githubAuthCallback = async (req,res)=>{ passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
})
};

const getCurrentUser = async (req, res) => {
    logger.info('Fetched current user', { user: req.user });
    res.status(200).send("Usuario Logeado");
};

const logout = async (req, res) => {
    const user = await userModel.findOne({email : req.session.user.email})
    user.last_connection = new Date()
    await user.save()
    req.session.destroy((err) => {
        if (err) {
            logger.error('Error during logout', { error: err });
        } else {
            logger.info('User logged out');
            res.status(200).redirect("/");
        }
    });
};

const testJWT = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        logger.debug('Test JWT', { user: req.user });
        if (req.user.rol == 'User') {
            logger.warn('Unauthorized user attempting access', { user: req.user });
            res.status(403).send("Usuario no autorizado");
        } else {
            logger.info('Authorized user access', { user: req.user });
            res.status(200).send(req.user);
        }
    })(req, res, next);
};

const changePassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const validateToken = jwt.verify(token.substr(6), varenv.jwt_secret);
        const user = await userModel.findOne({ email: validateToken.userEmail });
        if (user) {
            if (!validatePassword(newPassword, user.password)) {
                const hashPassword = createHash(newPassword);
                user.password = hashPassword;
                const resultado = await userModel.findByIdAndUpdate(user._id, user);
                logger.info('Password changed successfully', { user: user.email });
                res.status(200).send("Contraseña modificada correctamente");
            } else {
                logger.warn('New password cannot be the same as the old password', { user: user.email });
                res.status(400).send("Contraseña no puede ser identica a la anterior");
            }
        } else {
            logger.warn('User not found for password change', { email: validateToken.userEmail });
            res.status(404).send("No se encontró este usuario");
        }
    } catch (e) {
        if (e?.message == 'jwt expired') {
            logger.warn('Password change token expired', { token });
            res.status(400).send("Tiempo expirado para cambio de contraseña");
        } else {
            logger.error('Error during password change', { error: e });
            res.status(500).send(e);
        }
    }
};

const sendEmailPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            const token = jwt.sign({ userEmail: email }, varenv.jwt_secret, { expiresIn: '1h' });
            const resetLink = `http://localhost:8000/api/session/reset-password/token=${token}`;
            await sendEmailChangePassword(email, resetLink);
            logger.info('Password reset email sent', { email });
            res.status(200).send("Email enviado correctamente");
        } else {
            logger.warn('User not found for password reset email', { email });
            res.status(400).send("Usuario no encontrado");
        }
    } catch (e) {
        logger.error('Error sending password reset email', { error: e });
        res.status(500).send(e);
    }
};

export default { renderLoginPage, login, register, renderRegisterPage, githubAuth, githubAuthCallback, getCurrentUser, logout, testJWT, sendEmailPassword,changePassword };
