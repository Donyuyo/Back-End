// src/components/Register.js
import React, { useState } from 'react';
import api from '../api';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación simple
    const validationErrors = {};
    if (!firstName) validationErrors.firstName = "El nombre es requerido";
    if (!lastName) validationErrors.lastName = "El apellido es requerido";
    if (!email) validationErrors.email = "El email es requerido";
    if (!password) validationErrors.password = "La contraseña es requerida";
    if (!age || isNaN(age)) validationErrors.age = "La edad debe ser un número válido";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post('/session/register', { first_name: firstName, last_name: lastName, email, password, age });
      navigate('/login'); // Redirigir al login después del registro exitoso
    } catch (error) {
      console.error('Error registering:', error);
      setErrors({ apiError: error.response?.data || 'Error al registrar el usuario' });
    }
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8000/api/session/github'; // URL para autenticación con GitHub
  };

  return (
    <Container>
      <h1 className="mb-4">Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            isInvalid={!!errors.firstName}
          />
          <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            isInvalid={!!errors.lastName}
          />
          <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="age">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            isInvalid={!!errors.age}
          />
          <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
        </Form.Group>

        {errors.apiError && <p className="text-danger">{errors.apiError}</p>}

        <Button variant="primary" type="submit" className="mr-2">
          Register
        </Button>
        <Button variant="secondary" onClick={handleGithubLogin}>
          Register with GitHub
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
