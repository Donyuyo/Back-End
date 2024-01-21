import crypto from 'crypto';

console.log(crypto.randomBytes(6).toString('hex'))
class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(producto) {
    if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
      return "Todos los campos son obligatorios.";
    }

    const existe = this.products.some(prod => prod.code === producto.code);

    if (existe) {
      return "Producto ya existente";
    } else {
      producto.id = crypto.randomBytes(6).toString('hex');
      this.products.push(producto);
      return "Producto agregado correctamente";
    }
  }

  getProductById(productId) {
    const foundProduct = this.products.find(product => product.id === productId);

    if (foundProduct) {
      return foundProduct;
    } else {
      console.error('Producto con ID', productId, 'Not found.');
      return null;
    }
  }

  getProducts() {
    return this.products;
  }
}

const productManager = new ProductManager();


console.log('Productos al inicio:', productManager.getProducts());

console.log(
  productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  })
);


console.log('Productos después de agregar uno:', productManager.getProducts());

console.log(
  productManager.addProduct({
    title: 'producto prueba2',
    description: 'Este es un producto prueba 2',
    price: 300,
    thumbnail: 'Sin imagen2',
    code: 'abc1234', 
    stock: 45,
  })
);


console.log('Productos después de intentar agregar un producto repetido:', productManager.getProducts());


const productIdToFind = productManager.getProducts()[0].id; 
const foundProduct = productManager.getProductById(productIdToFind);


if (foundProduct) {
  console.log('Producto encontrado:', foundProduct);
} else {
  console.log('Producto no encontrado.');
}