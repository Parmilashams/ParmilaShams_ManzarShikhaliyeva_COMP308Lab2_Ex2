import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../index.css';

const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      role: $role
    ) {
      id
      username
      email
      role
    }
  }
`;

function AddUser() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Player',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createUser({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      });

      if (result.data.createUser) {
        setSuccessMessage('User created successfully.');
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'Player',
        });
      }
    } catch (err) {
      console.log('Create user error:', err.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="add-user-page">
      <div className="add-user-card">
        <div className="add-user-header">
          <h2>Create User</h2>
        </div>

        {error && (
          <Alert variant="danger" role="alert" className="mb-3">
            {error.message}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" role="alert" className="mb-3">
            {successMessage}
          </Alert>
        )}

        <Form
          className="add-user-form"
          onSubmit={handleSubmit}
          aria-label="Create user form"
        >
          <Form.Group className="mb-4" controlId="createUsername">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              aria-label="User name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="createEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              aria-label="Email address"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="createPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              aria-label="Password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="createRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              aria-label="Select user role"
            >
              <option value="Player">Player</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            className="add-user-btn"
            variant="primary"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AddUser;