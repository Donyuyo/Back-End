import logger from "../utils/logger.js";
import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";
import { userModel } from "../models/user.js";

export const createCart = async (req, res) => {
    try {
        const cart = await cartModel.create({ products: [] });
        res.status(201).json(cart);
        logger.info('Carrito creado correctamente');
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
        logger.error('Error al crear el carrito', { error });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel
            .findOne({ _id: cartId })
            .populate("products.id_prod");
        res.status(200).json(cart);
        logger.info('Carrito obtenido correctamente por ID', { id: cartId });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito por ID", error: error.message });
        logger.error('Error al obtener carrito por ID', { id: cartId, error });
    }
};

export const addOrUpdateProduct = async (req, res) => {
    try {
        const { cid: cartId, pid: productId } = req.params;
        const { quantity = 1 } = req.body;

        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId, "products.id_prod": productId },
            { $inc: { "products.$.quantity": quantity } },
            { new: true }
        );

        if (!updatedCart) {
            const newCart = await cartModel.findByIdAndUpdate(
                cartId,
                { $push: { products: { id_prod: productId, quantity } } },
                { new: true }
            );
            res.status(200).json(newCart);
            logger.info('Producto añadido al carrito', { cartId, productId, quantity });
        } else {
            res.status(200).json(updatedCart);
            logger.info('Producto actualizado en el carrito', { cartId, productId, quantity });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al añadir/actualizar producto en el carrito", error: error.message });
        logger.error('Error al añadir/actualizar producto en el carrito', { cartId: req.params.cid, error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { cid: cartId, pid: productId } = req.params;
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $pull: { products: { id_prod: productId } } },
            { new: true }
        );

        if (updatedCart) {
            res.status(200).json(updatedCart);
            logger.info('Producto eliminado del carrito', { cartId, productId });
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
            logger.warn('Carrito no encontrado al intentar eliminar producto', { cartId });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto del carrito", error: error.message });
        logger.error('Error al eliminar producto del carrito', { cartId: req.params.cid, error });
    }
};

export const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const newProducts = req.body;
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $set: { products: newProducts } },
            { new: true }
        );
        if (updatedCart) {
            res.status(200).json(updatedCart);
            logger.info('Carrito actualizado correctamente', { cartId });
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
            logger.warn('Intento de actualizar un carrito no encontrado', { cartId });
        }
    } catch (error) {
        res.status(500).json({ message: "Error interno al actualizar el carrito", error: error.message });
        logger.error('Error al actualizar el carrito', { cartId, error });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });

        if (updatedCart) {
            res.status(200).json({ message: "Carrito eliminado correctamente" });
            logger.info('Carrito eliminado correctamente', { cartId });
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
            logger.warn('Intento de eliminar un carrito no encontrado', { cartId });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el carrito", error: error.message });
        logger.error('Error al eliminar el carrito', { cartId, error });
    }
};

export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);
        const prodSinStock = [];

        if (cart) {
            for (const prod of cart.products) {
                let producto = await productModel.findById(prod.id_prod);
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto);
                }
            }

            if (prodSinStock.length == 0) {
                const user = await userModel.findById(req.user._id);
                let totalPrice = cart.products.reduce((total, prod) => total + (prod.price * prod.quantity), 0);

                if (user.rol === 'Premium') {
                    totalPrice *= 0.9; // Apply 10% discount
                }

                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalPrice,
                    products: cart.products
                });

                // Vaciar carrito
                await cartModel.findByIdAndUpdate(
                    cartId,
                    { products: [] },
                    { new: true }
                );

                res.status(200).json(newTicket);
                logger.info('Ticket creado correctamente');
            } else {
                // Eliminar productos sin stock del carrito
                await Promise.all(prodSinStock.map(async (prod) => {
                    await cartModel.findByIdAndUpdate(
                        cartId,
                        { $pull: { products: { id_prod: prod._id } } },
                        { new: true }
                    );
                }));
                
                res.status(400).json("Algunos productos no tienen stock suficiente");
                logger.warn('Algunos productos no tienen stock suficiente');
            }
        } else {
            res.status(404).json("Carrito no existe");
            logger.warn('Intento de crear ticket para un carrito que no existe');
        }
    } catch (error) {
        res.status(500).json(`Error interno del servidor: ${error}`);
        logger.error('Error interno al crear ticket', { error });
    }
};

export default { createCart, getCartById, addOrUpdateProduct, deleteProduct, updateCart, deleteCart, createTicket };
