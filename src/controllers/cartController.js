import cartModel from "../models/cart.js";

const createCart = async (req, res) => {
    try {
        const mensaje = await cartModel.create({ products: [] });
        res.status(201).send(mensaje);
    } catch (error) {
        res.status(500).send(`Internal error when creating cart: ${error}`);
    }
};

const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel
            .findOne({ _id: cartId })
            .populate("products.id_prod");
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send(`Internal error when reading products from cart: ${error}`);
    }
};

const addOrUpdateProduct = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        let { quantity } = req.body;

        if (quantity === undefined) {
            quantity = 1;
        }

        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId, "products.id_prod": productId },
            { $inc: { "products.$.quantity": quantity } },
            { new: true }
        );

        if (!updatedCart) {
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                { $push: { products: { id_prod: productId, quantity: quantity } } },
                { new: true }
            );
            res.status(200).send(cart);
        } else {
            res.status(200).send(updatedCart);
        }
    } catch (error) {
        res.status(500).send(`Internal error when adding/updating product in cart: ${error}`);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $pull: { products: { id_prod: productId } } },
            { new: true }
        );

        if (updatedCart) {
            res.status(200).send(updatedCart);
        } else {
            res.status(404).send("Cart not found");
        }
    } catch (error) {
        res.status(500).send(`Internal error when deleting product from cart: ${error}`);
    }
};

const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const newProducts = req.body;
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $set: { products: newProducts } },
            { new: true }
        );
        if (!updatedCart) {
            return res.status(404).send("Cart not found");
        }

        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send(`Internal error when updating cart: ${error}`);
    }
};

const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).send("Cart not found");
        }

        res.status(200).send("Cart removed!");
    } catch (error) {
        res.status(500).send(`Internal error when deleting cart: ${error}`);
    }
};

export default {createCart,getCartById,addOrUpdateProduct,deleteProduct,updateCart,deleteCart};