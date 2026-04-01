import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import UserList from './components/UserList';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import TournamentList from './components/TournamentList';
import AddTournament from './components/AddTournament';
import PlayerList from './components/PlayerList';
import JoinTournament from './components/JoinTournament';
import TournamentHistory from './components/TournamentHistory';
import ProtectedRoute from './components/ProtectedRoute';
import EditTournament from './components/EditTournament';
import AddUser from './components/AddUser';
import UserEdit from './components/UserEdit';

import { ME, LOGOUT } from './me';

function App() {
  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery(ME, {
    fetchPolicy: 'network-only',
  });

  const [logoutMutation] = useMutation(LOGOUT);

  const loggedInUser = data?.me || null;

  const handleLogout = async () => {
    try {
      await logoutMutation();
      await refetch();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" aria-label="Main navigation">
        <Container>
          <Navbar.Brand as={Link} to="/">Gaming Tournaments</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            aria-label="Toggle navigation"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/tournaments">Tournaments</Nav.Link>

              {!loggedInUser && !loading && (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}

              {loggedInUser?.role === 'Admin' && (
                <>
                  <Nav.Link as={Link} to="/adduser">Add User</Nav.Link>
                  <Nav.Link as={Link} to="/addtournament">Add Tournament</Nav.Link>
                  <Nav.Link as={Link} to="/users">Users</Nav.Link>
                  <Nav.Link as={Link} to="/players">Players</Nav.Link>
                </>
              )}

              {loggedInUser?.role === 'Player' && (
                <>
                  <Nav.Link as={Link} to="/join">Join Tournament</Nav.Link>
                  <Nav.Link as={Link} to="/history">Tournament History</Nav.Link>
                </>
              )}
            </Nav>

            {loggedInUser && (
              <Nav className="align-items-center">
                <Navbar.Text className="me-3">
                  Signed in as: {loggedInUser.username} ({loggedInUser.role})
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </Button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home user={loggedInUser} />} />
          <Route path="/login" element={<Login onAuthChange={refetch} />} />
          <Route path="/register" element={<Register onAuthChange={refetch} />} />
          <Route path="/tournaments" element={<TournamentList />} />

          <Route
            path="/adduser"
            element={
              <ProtectedRoute user={loggedInUser} allowedRole="Admin">
                <AddUser />
              </ProtectedRoute>
            }
          />

      <Route
  path="/users"
  element={
    <ProtectedRoute user={loggedInUser} allowedRole="Admin">
      <UserList />
    </ProtectedRoute>
  }
/>

<Route
  path="/edituser/:id"
  element={
    <ProtectedRoute user={loggedInUser} allowedRole="Admin">
      <UserEdit />
    </ProtectedRoute>
  }
/>
          <Route
            path="/addtournament"
            element={
              <ProtectedRoute user={loggedInUser} allowedRole="Admin">
                <AddTournament />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edittournament/:id"
            element={
              <ProtectedRoute user={loggedInUser} allowedRole="Admin">
                <EditTournament />
              </ProtectedRoute>
            }
          />

          <Route
            path="/players"
            element={
              <ProtectedRoute user={loggedInUser} allowedRole="Admin">
                <PlayerList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/join"
            element={
              <ProtectedRoute user={loggedInUser} allowedRole="Player">
                <JoinTournament />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute user={loggedInUser} allowedRole="Player">
                <TournamentHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;