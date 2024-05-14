import { Router } from "express";
import passport from "passport";
import cartController from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.post("/", cartController.createCart);

cartRouter.get("/:cid", cartController.getCartById);

cartRouter.post("/:cid/:pid",passport.authenticate('jwt', { session: false }), cartController.addOrUpdateProduct);

cartRouter.delete("/:cid/products/:pid", cartController.deleteProduct);

cartRouter.put("/:cid", cartController.updateCart);

cartRouter.delete("/:cid", cartController.deleteCart);

cartRouter.post('/:cid/purchase', cartController.createTicket)

export default cartRouter;
