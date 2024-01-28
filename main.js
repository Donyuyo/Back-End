import { Product } from "./Products.js";
import { ProductManager } from "./ProductManager.js";

const producto1 = new Product("Polera Punisher", "Camiseta The Punisher estampado en alta calidad directo en la tela", 19.90, 29, "A123")
const producto2 = new Product("Polera Marvel", "Polera Estampada, textil de alta calidad y durabilida.", 19.90, 22, "L123")
const producto3 = new Product("Anillo Punisher", "Anillo Punisher Anillo Calavera Acero Titanium Descripción Anillo Acero Titanium", 9.90, 10, "Y243")
const producto4 = new Product("AzucarPin Marverl Dead Pool", "100% nuevo Alta calidad Tipo de producto: Broche Material: aleación Metálica", 9.90, 14, "A433")

const producto1version2 = new Product("Polera Punisher", "Camiseta The Punisher estampado en alta calidad directo en la tela", 19.90, 29, "A123")

const productManager = new ProductManager('./products.json')

productManager.addProduct(producto1)
//productManager.addProduct(producto2)
//productManager.addProduct(producto3)
//productManager.addProduct(producto4)
//productManager.getProducts()
//productManager.getProductById('')
//productManager.updateProduct('', producto1version2)
//productManager.deleteProduct('')