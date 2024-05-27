import passport from "passport";
import logger from "../utils/logger.js";  // Asegúrate de usar la extensión .js si tu archivo de logger tiene esa extensión.

const renderLoginPage = (req, res) => {
    res.render('templates/login');
    logger.info('Rendered login page');
};

const login = (req, res, next) => {
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

const register = (req, res, next) => {
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

const renderRegisterPage = (req, res) => {
    res.render('templates/register');
    logger.info('Rendered register page');
};

const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

const githubAuthCallback = passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
});

const getCurrentUser = (req, res) => {
    logger.info('Fetched current user', { user: req.user });
    res.status(200).send("Usuario Logeado");
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error('Error during logout', { error: err });
        } else {
            logger.info('User logged out');
            res.status(200).redirect("/");
        }
    });
};

const testJWT = (req, res, next) => {
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

export default { renderLoginPage, login, register, renderRegisterPage, githubAuth, githubAuthCallback, getCurrentUser, logout, testJWT };
