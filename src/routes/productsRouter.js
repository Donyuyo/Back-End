import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById } from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/:pid", getProductById);

productsRouter.post("/", createProduct);

productsRouter.put("/:pid", updateProductById);

productsRouter.delete("/:pid", deleteProductById);

export default productsRouter;
