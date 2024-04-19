import passport from "passport";

const renderLoginPage = (req, res) => {
    res.render('templates/login');
};

const login = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(401).send("Usuario o contraseña no válidos");
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.session.user = {
                    email: req.user.email,
                    first_name: req.user.first_name
                };
                return res.status(200).send("Usuario logueado correctamente");
            });
        } catch (err) {
            return next(err);
        }
    })(req, res, next);
};

const register = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(400).send("Usuario ya existente en la aplicación");
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).send("Usuario creado correctamente");
            });
        } catch (err) {
            return next(err);
        }
    })(req, res, next);
};

const renderRegisterPage = (req, res) => {
    res.render('templates/register');
};

const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

const githubAuthCallback = passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
});

const getCurrentUser = (req, res) => {
    res.status(200).send("Usuario Logeado");
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).redirect("/");
        }
    });
};

const testJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).send("Token JWT inválido");
        }
        res.status(200).send(user);
    })(req, res, next);
};


export default { renderLoginPage, login, register, renderRegisterPage, githubAuth, githubAuthCallback, getCurrentUser, logout, testJWT };