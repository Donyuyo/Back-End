import React, { useState } from 'react';
import api from '../api';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/session/login', { email, password });
      setSuccessMessage('Login success');
      setErrorMessage('');
      navigate('/cart');
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Login failed: ' + (error.response?.data?.message || 'Email or password incorrect'));
      navigate('/register');
    }
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8000/api/session/github';
  };

  return (
    <Container>
      <h1 className="mb-4">Login</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <div className="mt-3">
        <Button variant="dark" onClick={handleGithubLogin}>
          Login with GitHub
        </Button>
      </div>
    </Container>
  );
};

export default Login;
