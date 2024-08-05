import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/session/current');
        if (response.data.rol !== 'Admin') {
          alert("Access denied. Admins only.");
          navigate('/login');
        } else {
          fetchUsers();
        }
      } catch (error) {
        setError("User is not authenticated or an error occurred.");
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users.");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully.');
    } catch (error) {
      setError("Error deleting user.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin - Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this user?')) {
                      deleteUser(user._id);
                    }
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsers;
