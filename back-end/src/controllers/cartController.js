import logger from "../utils/logger.js";
import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";

export const createCart = async (req, res) => {
    try {
        const mensaje = await cartModel.create({ products: [] });
        res.status(201).send(mensaje);
        logger.info('Carrito creado correctamente');
    } catch (error) {
        res.status(500).send(`Error interno al crear el carrito: ${error}`);
        logger.error('Error al crear el carrito', { error });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel
            .findOne({ _id: cartId })
            .populate("products.id_prod");
        res.status(200).send(cart);
        logger.debug('Carrito obtenido correctamente por ID');
    } catch (error) {
        res.status(500).send(`Error interno al leer los productos del carrito: ${error}`);
        logger.error('Error al obtener carrito por ID', { error });
    }
};

export const addOrUpdateProduct = async (req, res) => {
    try {
        if(req.user.rol == "User"){
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
            logger.info('Producto añadido o actualizado en el carrito');
        }else {
            res.status(403).send("Usuario no autorizado")
            logger.warn('Intento de añadir producto por un usuario no autorizado');
        }
    } catch (error) {
        res.status(500).send(`Error interno al añadir/actualizar producto en el carrito: ${error}`);
        logger.error('Error al añadir/actualizar producto en el carrito', { error });
    }
};

export const deleteProduct = async (req, res) => {
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
            logger.info('Producto eliminado del carrito');
        } else {
            res.status(404).send("Carrito no encontrado");
            logger.warn('Intento de eliminar producto de un carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send(`Error interno al eliminar producto del carrito: ${error}`);
        logger.error('Error al eliminar producto del carrito', { error });
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
        if (!updatedCart) {
            return res.status(404).send("Carrito no encontrado");
            logger.warn('Intento de actualizar un carrito no encontrado');
        }

        res.status(200).send(updatedCart);
        logger.info('Carrito actualizado correctamente');
    } catch (error) {
        res.status(500).send(`Error interno al actualizar el carrito: ${error}`);
        logger.error('Error al actualizar el carrito', { error });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).send("Carrito no encontrado");
            logger.warn('Intento de eliminar un carrito no encontrado');
        }

        res.status(200).send("Carrito eliminado!");
        logger.info('Carrito eliminado correctamente');
    } catch (error) {
        res.status(500).send(`Error interno al eliminar el carrito: ${error}`);
        logger.error('Error al eliminar el carrito', { error });
    }
};

export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);
        const prodSinStock = [];

        if (cart) {
            cart.products.forEach(async (prod) => {
                let producto = await productModel.findById(prod.id_prod);
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto);
                }
            });

            if (prodSinStock.length == 0) {
                const totalPrice = cart.products.reduce((a, b) => (a.price* a.quantity)+(b.price*b.quantity), 0);
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

                res.status(200).send(newTicket);
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
                
                res.status(400).send("Algunos productos no tienen stock suficiente");
                logger.warn('Algunos productos no tienen stock suficiente');
            }
        } else {
            res.status(404).send("Carrito no existe");
            logger.warn('Intento de crear ticket para un carrito que no existe');
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor: ${error}`);
        logger.error('Error interno al crear ticket', { error });
    }
};

export default {createCart,getCartById,addOrUpdateProduct,deleteProduct,updateCart,deleteCart, createTicket};