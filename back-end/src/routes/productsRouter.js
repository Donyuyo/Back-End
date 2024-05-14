import { Router } from "express";
import passport from "passport";
import { getAllProducts, getProductById, createProduct, deleteProduct, updateProduct } from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/:pid", getProductById);

productsRouter.post("/", passport.authenticate('jwt', { session: false }), createProduct);

productsRouter.put("/:pid",passport.authenticate('jwt', { session: false }), updateProduct);

productsRouter.delete("/:pid",passport.authenticate('jwt', { session: false }), deleteProduct);

export default productsRouter;
