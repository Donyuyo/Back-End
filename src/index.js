import express from 'express'
import { ProductManager } from './config/ProductManager.js';


const app = express()
const PORT = 8000
const productManager = new ProductManager('./src/data/products.json')

app.get('/', (req, res) => {
    res.send("Hola, desde mi primer servidor en Express")
})

app.get('/products', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()
    const limite = parseInt(limit)
    if (limite) {
        if (limite < 0) {
            res.send("Ingrese un numero valido para los queries")
        } else {
            const prodsLimit = prods.slice(0, limit)
            res.send(prodsLimit)
        }

    } else {
        res.send("Ingrese un valor valido en los Queries")
    }


})

app.get('/products/:pid', async (req, res) => {
    const idProducto = req.params.pid 
    const prod = await productManager.getProductById(idProducto)
    res.send(prod)
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})