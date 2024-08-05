import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('/api/cart');
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart", error);
            }
        };

        fetchCart();
    }, []);

    const removeProduct = async (productId) => {
        try {
            await axios.delete(`/api/cart/products/${productId}`);
            setCart(cart.filter(item => item._id !== productId));
        } catch (error) {
            console.error("Error removing product", error);
        }
    };

    const checkout = async () => {
        try {
            await axios.post('/api/cart/purchase');
        } catch (error) {
            console.error("Error during checkout", error);
        }
    };

    return (
        <Container>
            <h1 className="mb-4">Shopping Cart</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item._id}>
                            <td>{item.product.title}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <Button variant="danger" onClick={() => removeProduct(item._id)}>Remove</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button variant="success" onClick={checkout}>Checkout</Button>
        </Container>
    );
};

export default Cart;