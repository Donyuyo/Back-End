import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const NavbarComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await api.get('/session/current');
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/session/logout');
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Navbar.Brand as={Link} to="/">
                <img
                    src="https://www.gustore.cl/img/estampados/377/377.png"
                    width="30px"
                    height="30px"
                    className="d-inline-block align-top"
                    alt=""
                />{' '}
                Back-End
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">Admin</Nav.Link>
                </Nav>
                {isLoggedIn && (
                    <Button variant="outline-light" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;