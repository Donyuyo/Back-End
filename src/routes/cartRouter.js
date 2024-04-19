import { Router } from "express";
import cartController from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.post("/", cartController.createCart);

cartRouter.get("/:cid", cartController.getCartById);

cartRouter.post("/:cid/:pid", cartController.addOrUpdateProduct);

cartRouter.delete("/:cid/products/:pid", cartController.deleteProduct);

cartRouter.put("/:cid", cartController.updateCart);

cartRouter.delete("/:cid", cartController.deleteCart);

export default cartRouter;
