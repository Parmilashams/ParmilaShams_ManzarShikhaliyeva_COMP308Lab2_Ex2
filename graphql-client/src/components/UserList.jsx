import React from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

function UserList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER);

  const users = data?.users ?? [];

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmDelete) return;

    try {
      await deleteUser({
        variables: { id },
      });

      await refetch();
    } catch (err) {
      console.error('Delete user error:', err.message);
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
      <h2 className="mb-4">All Users</h2>

      {users.length === 0 ? (
        <Alert variant="info" role="alert">
          No users found.
        </Alert>
      ) : (
        <Table striped bordered hover responsive aria-label="Users table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/edituser/${user.id}`}
                    variant="warning"
                    size="sm"
                    aria-label={`Edit user ${user.username}`}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteLoading}
                    aria-label={`Delete user ${user.username}`}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="mt-3">
        <Button variant="secondary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
    </Card>
  );
}

export default UserList;