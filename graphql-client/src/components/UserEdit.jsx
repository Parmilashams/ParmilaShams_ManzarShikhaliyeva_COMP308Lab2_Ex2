import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      role
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $username: String!
    $email: String!
    $role: String!
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      role: $role
    ) {
      id
      username
      email
      role
    }
  }
`;

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Player',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  const [updateUser, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER);

  useEffect(() => {
    if (data?.user) {
      setFormData({
        username: data.user.username || '',
        email: data.user.email || '',
        role: data.user.role || 'Player',
      });
    }
  }, [data]);

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
      const result = await updateUser({
        variables: {
          id,
          username: formData.username,
          email: formData.email,
          role: formData.role,
        },
      });

      if (result.data.updateUser) {
        setSuccessMessage('User updated successfully.');

        setTimeout(() => {
          navigate('/users');
        }, 1000);
      }
    } catch (err) {
      console.error('Update user error:', err.message);
      setSuccessMessage('');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" role="alert">
        {error.message}
      </Alert>
    );
  }

  return (
    <Card className="p-4 shadow-sm">
      <h2 className="mb-4">Edit User</h2>

      {updateError && (
        <Alert variant="danger" role="alert">
          {updateError.message}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" role="alert">
          {successMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} aria-label="Edit user form">
        <Form.Group className="mb-3" controlId="editUsername">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter user name"
            aria-label="User name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editEmail">
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

        <Form.Group className="mb-4" controlId="editRole">
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

        <div className="d-flex gap-2">
          <Button type="submit" disabled={updateLoading} aria-busy={updateLoading}>
            {updateLoading ? 'Updating...' : 'Update User'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/users')}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default UserEdit;