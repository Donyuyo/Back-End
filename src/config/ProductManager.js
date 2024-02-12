import { promises as fs } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8');
            if (fileContent.trim() === '') {
                console.log('El archivo está vacío.');
            } else {
                const prods = JSON.parse(fileContent);
                return prods;
            }
        } catch (error) {
            console.error('Error al leer o parsear el archivo:', error.message);
        }
    }

    async getProductById(id) {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8');
            const prods = JSON.parse(fileContent);
            const prod = prods.find(producto => producto.id === id);
            if (prod) {
                return prod;
            } else {
                return 'Producto no existe';
            }
        } catch (error) {
            return 'Error al leer o parsear el archivo:', error.message;
        }
    }

    async addProduct(newProduct) {
        try {
            let fileContent = await fs.readFile(this.path, 'utf-8');
            
            if (!fileContent.trim()) {
                fileContent = '[]';
            }

            const prods = JSON.parse(fileContent);

            const requiredFields = ['code', 'title', 'description', 'price', 'stock'];

            const missingFields = requiredFields.filter(field => !newProduct[field]);

            if (missingFields.length === 0) {
                const indice = prods.findIndex(prod => prod.code === newProduct.code);

                if (indice === -1) {
                    prods.push(newProduct);
                    await fs.writeFile(this.path, JSON.stringify(prods));
                    console.log('Producto creado correctamente');
                    return 'Producto cargado correctamente';
                } else {
                    console.log('Producto ya existe en este array');
                    return 'Producto ya existe en este array';
                }
            } else {
                console.log(`Faltan campos requeridos: ${missingFields.join(', ')}`);
                return `Faltan campos requeridos: ${missingFields.join(', ')}`;
            }
        } catch (error) {
            console.error('Error al leer o parsear el archivo:', error.message);
        }
    }

    async updateProduct(id, nuevoProducto) {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8');
            const prods = JSON.parse(fileContent);
            const indice = prods.findIndex(producto => producto.id === id);

            if (indice !== -1) {
                prods[indice].stock = nuevoProducto.stock;
                prods[indice].price = nuevoProducto.price;
                prods[indice].title = nuevoProducto.title;
                prods[indice].thumbnail = nuevoProducto.thumbnail;
                prods[indice].description = nuevoProducto.description;
                prods[indice].code = nuevoProducto.code;

                await fs.writeFile(this.path, JSON.stringify(prods));
                console.log('Producto actualizado correctamente');
            } else {
                console.log('Producto no existe');
            }
        } catch (error) {
            console.error('Error al leer o parsear el archivo:', error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8');
            const prods = JSON.parse(fileContent);
            const indice = prods.findIndex(producto => producto.id === id);

            if (indice !== -1) {
                const prodsFiltrados = prods.filter(prod => prod.id !== id);
                await fs.writeFile(this.path, JSON.stringify(prodsFiltrados));
                console.log('Producto eliminado correctamente');
            } else {
                console.log('Producto no existe');
            }
        } catch (error) {
            console.error('Error al leer o parsear el archivo:', error.message);
            throw error;
        }
    }
}