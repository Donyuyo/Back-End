import varenv from './dotenv.js';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import messageModel from './models/message.js';
import indexRouter from './routes/indexRouter.js';
import initializePassport from './config/passport/passport.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { __dirname } from './path.js';
import logger from '../src/utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import productModel from './models/product.js';
import cors from 'cors'

// Configuraciones o declaraciones
const app = express();
const PORT = 8000;


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Server
const server = app.listen(PORT, () => {
    logger.info(`Server on port ${PORT}`);
});

const io = new Server(server);

// Conexión a DB
mongoose.connect(varenv.mongo_url)
    .then(() => logger.info("DB is connected"))
    .catch(e => logger.error(e));

// Middlewares
app.use(express.json());

app.use(session({
    secret: varenv.session_secret,
    resave: true,
    store: MongoStore.create({
        mongoUrl: varenv.mongo_url,
        ttl: 60 * 60    
    }),
    saveUninitialized: true
}));
app.use(cookieParser(varenv.cookies_secret));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Route para productos
app.get("/productos", async (req, res) => {
    try {
        const productos = await productModel.find({}).lean();
        res.render("home", { productos }); 
    } catch (error) {
        logger.error("Error al obtener productos:", error);
        res.render("error", { error });
    }
});

// Documentación Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de mi aplicacion',
            description: 'Descripcion de documentacion'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Routes
app.use('/', indexRouter);

// Route Cookies
app.get("/setCookie", (req, res) => {
    res
        .cookie("CookieCookie", "Esto es una cookie", {
            maxAge: 30000000000,
            signed: true,
        })
        .send("Cookie Creada");
});

app.get("/getCookie", (req, res) => {
    res.send(req.signedCookies);
});

app.get("/deleteCookie", (req, res) => {
    res.clearCookie("CookieCookie").send("Cookie Eliminada");
});

// Routes Session
app.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Eres el user num ${req.session.counter} en ingresar a la pagina`);
    } else {
        req.session.counter = 1;
        res.send("Eres el primer user en ingresar a la page");
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email == "admin@admin.com" && password == "1234") {
        req.session.email = email;
        req.session.password = password;
        res.send("login valido");
    } else {
        res.send("login invalido");
    }
});

io.on("connection", (socket) => {
    logger.info("Conexion con Socket.io");

    socket.on("mensaje", async (mensaje) => {
        try {
            await messageModel.create(mensaje);
            const mensajes = await messageModel.find();
            io.emit("mensajeLogs", mensajes);
        } catch (error) {
            logger.error("Error al procesar mensaje:", error);
            io.emit("mensajeLogs", error);
        }
    });
});

export default app;
