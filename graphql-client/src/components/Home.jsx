import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import ThreeScene from './ThreeScene';

function Home({ user }) {

  let buttons;

  if (!user) {
    buttons = (
      <>
        <Button as={Link} to="/register" variant="primary" className="me-2">
          Register
        </Button>
        <Button as={Link} to="/login" variant="success">
          Login
        </Button>
      </>
    );
  } else if (user.role === 'Admin') {
    buttons = (
      <>
        <Button as={Link} to="/tournaments" variant="primary" className="me-2">
          View Tournaments
        </Button>
        <Button as={Link} to="/players" variant="success">
          Browse Players
        </Button>
      </>
    );
  } else {
    buttons = (
      <>
        <Button as={Link} to="/tournaments" variant="primary" className="me-2">
          Browse Tournaments
        </Button>
        <Button as={Link} to="/history" variant="success">
          My History
        </Button>
      </>
    );
  }

  return (
    <div className="home-page">

      {/* Welcome message after login */}
      {user && (
        <Alert variant="success" className="mb-4 text-center">
          Welcome back! You are successfully signed in.
        </Alert>
      )}

      <div className="home-hero">
        <div className="home-hero-content">
          <p className="home-badge">Gaming Tournament Platform</p>

          <h1 className="home-title">
            Welcome to Gaming Tournament System
          </h1>

          <p className="home-subtitle">
            Compete, join tournaments, manage players, and track gaming events in one place.
          </p>

          <div className="home-buttons">
            {buttons}
          </div>
        </div>

        <div className="mb-4">
          <ThreeScene />
        </div>
      </div>

      <Card className="home-info-card mb-4">
        <Card.Body>
          <Card.Text>
            This system allows players to participate in gaming tournaments and
            administrators to manage tournaments and players.
          </Card.Text>
        </Card.Body>
      </Card>

    <div className="home-feature-grid">
        <Card className="home-feature-card">
          <Card.Body>
            <h4>Player Features</h4>
            <ul>
              <li>Register and login</li>
              <li>Browse tournaments</li>
              <li>Join tournaments</li>
              <li>View tournament history</li>
            </ul>
          </Card.Body>
        </Card>

        <Card className="home-feature-card">
          <Card.Body>
            <h4>Admin Features</h4>
            <ul>
              <li>Create tournaments</li>
              <li>Manage users</li>
              <li>Assign players to tournaments</li>
              <li>View player rankings</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Home;