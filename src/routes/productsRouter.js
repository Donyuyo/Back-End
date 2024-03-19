import { Router } from "express";
import productModel from "../models/product.js";
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter == "true" || filter == "false") {
            metFilter = "status";
        } else {
            if (filter !== undefined) metFilter = "category";
        }

        const query = metFilter != undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        const prods = await productModel.paginate(query, {
            limit: limi,
            page: pag,
            sort: ordQuery,
        });
        n;
        res.status(200).send(prods);
    } catch (error) {
        res.status(500).render("templates/error", {
            error: error,
        });
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const prod = await productModel.findById(idProducto);
        if (prod) {
            res.status(200).send(prod);
        } else {
            res.status(404).send("Producto no existe");
        }
    } catch (error) {
        res
            .status(500)
            .send(`Error interno del servidor al consultar producto:${error}`);
    }
});
productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const mensaje = await productModel.create(newProduct);
        res.status(201).send(mensaje);
    } catch (error) {
        res
            .status(500)
            .send(`Error interno del servidor al consultar producto:${error}`);
    }
});

productsRouter.put("/:pid", async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const updatedProduct = req.body;
        const prod = await productModel.findByIdAndUpdate(
            idProducto,
            updatedProduct
        );
        res.status(200).send(prod);
        } catch (error) {
        res
            .status(500)
            .send(`Error interno del servidor al consultar producto:${error}`);
    }
});
productsRouter.delete("/:pid", async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const mensaje = await productModel.findByIdAndDelete(idProducto);
        res.status(200).send(mensaje);
    } catch (error) {
        res
            .status(500)
            .send(`Error interno del servidor al consultar producto:${error}`);
    }
});
export default productsRouter;