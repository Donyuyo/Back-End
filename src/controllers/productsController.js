import productModel from "../models/product.js";

// Controlador para obtener todos los productos
export const getAllProducts = async (req, res) => {
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

        // Renderizar la vista de productos con los datos obtenidos
        res.render("templates/home", { mostrarProductos: true, productos: prods });

    } catch (error) {
        // Si hay un error, renderizar la vista de error
        res.status(500).render("templates/error", {
            error: error,
        });
    }
};

// Controlador para obtener un producto por su ID
export const getProductById = async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const prod = await productModel.findById(idProducto);
        if (prod) {
            res.status(200).send(prod);
        } else {
            res.status(404).send("Producto no existe");
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto:${error}`);
    }
};

// Controlador para crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        const mensaje = await productModel.create(newProduct);
        res.status(201).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto:${error}`);
    }
};

// Controlador para actualizar un producto por su ID
export const updateProductById = async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const updatedProduct = req.body;
        const prod = await productModel.findByIdAndUpdate(
            idProducto,
            updatedProduct
        );
        res.status(200).send(prod);
        } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto:${error}`);
    }
};

// Controlador para eliminar un producto por su ID
export const deleteProductById = async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const mensaje = await productModel.findByIdAndDelete(idProducto);
        res.status(200).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto:${error}`);
    }
};