import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate(); // Definir navigate
  
  const imageUrls = {
    "Anillo Punisher": "https://http2.mlstatic.com/D_NQ_NP_830937-MLC72671646333_112023-O.webp",
    "Polera Marvel": "https://http2.mlstatic.com/D_NQ_NP_663684-MLC53291641510_012023-O.webp",
    "Polera Punisher": "https://http2.mlstatic.com/D_NQ_NP_928208-MLC46034378207_052021-O.webp",
    "Pin Marverl Dead Pool": "https://http2.mlstatic.com/D_NQ_NP_739480-MLC32440184163_102019-O.webp"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.docs);
        setQuantities(response.data.docs.reduce((acc, product) => {
          acc[product._id] = 1; // Inicializa la cantidad a 1 para cada producto
          return acc;
        }, {}));
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, amount) => {
    setQuantities(prevQuantities => {
      const newQuantity = prevQuantities[productId] + amount;
      if (newQuantity < 1) return prevQuantities; // Evita cantidades menores a 1
      const product = products.find(p => p._id === productId);
      if (newQuantity > product.stock) return prevQuantities; // No permite exceder el stock
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.get('/session/current'); // Verificar si el usuario está autenticado
      const quantity = quantities[productId];
      await api.post(`/cart/${productId}`, { quantity });
      console.log('Product added to cart');
      navigate('/cart'); // Redirigir al carrito después de agregar el producto
    } catch (error) {
      console.error('Failed to add product to cart or user not authenticated', error);
      navigate('/login'); // Redirigir al login si no está autenticado
    }
  };

  return (
    <Row>
      {products.map(product => (
        <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src={imageUrls[product.title]} alt={product.title} className="product-img" />
            <Card.Body>
              <Card.Title>{product.title}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Card.Text>Price: ${product.price}</Card.Text>
              <Card.Text>Stock: {product.stock}</Card.Text>
              <InputGroup className="mb-3">
                <Button variant="outline-secondary" onClick={() => handleQuantityChange(product._id, -1)}>-</Button>
                <FormControl
                  type="text"
                  value={quantities[product._id]}
                  readOnly
                  className="text-center"
                />
                <Button variant="outline-secondary" onClick={() => handleQuantityChange(product._id, 1)}>+</Button>
              </InputGroup>
              <Button variant="primary" onClick={() => handleAddToCart(product._id)}>Add to Cart</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
