import cartRouter from './cartRouter.js'
import productsRouter from './productsRouter.js'
import userRouter from './userRouter.js'
import chatRouter from './chatRouter.js'
import upload from '../config/multer.js'
import sessionRouter from './sessionRouter.js'
import express from 'express'
import { __dirname } from '../path.js'
import multerRouter from './multerRouter.js'
import mockingRouter from './mockingRouter.js';
import loggerTestRouter from './loggerTestRouter.js'

const indexRouter = express.Router()

//Routes
indexRouter.get('/', (req, res) => {
    res.status(200).send("Bienvenido/a!")
})
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)
indexRouter.use('/upload', multerRouter)
indexRouter.use('/api', mockingRouter);
indexRouter.use('/api', loggerTestRouter);

export default indexRouter