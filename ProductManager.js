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


const product1 = {
  title: 'Producto 1',
  description: 'Descripcion 1',
  price: 20,
  thumbnail: 'img.jpg',
  code: 'CODE1',
  stock: 50,
};

const product2 = {
  title: 'Producto 2',
  description: 'Descripcion 2',
  price: 30,
  thumbnail: 'img.jpg',
  code: 'CODE2',
  stock: 30,
};


console.log(productManager.addProduct(product1));
console.log(productManager.addProduct(product2));


const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);


const productIdToFind = allProducts[0].id; 
const foundProduct = productManager.getProductById(productIdToFind);


if (foundProduct) {
  console.log('Producto encontrado:', foundProduct);
} else {
  console.log('Producto no encontrado.');
}