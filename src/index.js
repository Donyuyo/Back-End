import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import messageModel from './models/message.js'
import indexRouter from './routes/indexRouter.js'
import initializePassport from './config/passport/passport.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'

//Configuraciones o declaraciones
const app = express()
const PORT = 8000

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Coneccion a DB
mongoose.connect("mongodb+srv://rodrigoelzoleon:coderhouse@cluster0.2okvl4z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB is connected"))
.catch(e => console.log(e))

//Middlewares
app.use(express.json())

app.use(session({
    secret: "coderSecret",
    resave: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://rodrigoelzoleon:coderhouse@cluster0.2okvl4z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 60 * 60
    }),
    saveUninitialized: true
}))
app.use(cookieParser("claveSecreta"))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes

app.use('/', indexRouter)
//Route Cookies
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


//Routes Session
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
    }
    res.send("login invalido");
});

io.on("connection", (socket) => {
    console.log("Conexion con Socket.io");

    socket.on("mensaje", async (mensaje) => {
        try {
            await messageModel.create(mensaje);
            const mensajes = await messageModel.find();
            io.emit("mensajeLogs", mensajes);
        } catch (error) {
            io.emit("mensajeLogs", error);
        }
    });
});