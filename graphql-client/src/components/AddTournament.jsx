import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../index.css';

const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($name: String!, $game: String!, $date: String!, $status: String!) {
    createTournament(name: $name, game: $game, date: $date, status: $status) {
      id
      name
      game
      date
      status
    }
  }
`;

function AddTournament() {
  const [tournamentData, setTournamentData] = useState({
    name: '',
    game: '',
    date: '',
    status: 'Upcoming',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [createTournament, { loading, error }] = useMutation(CREATE_TOURNAMENT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournamentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createTournament({
        variables: {
          name: tournamentData.name,
          game: tournamentData.game,
          date: tournamentData.date,
          status: tournamentData.status,
        },
      });

      if (result.data?.createTournament) {
        setSuccessMessage('Tournament created successfully.');
        setTournamentData({
          name: '',
          game: '',
          date: '',
          status: 'Upcoming',
        });
      }
    } catch (err) {
      console.log('Create tournament error:', err.message);
    }
  };

  return (
    <div className="add-tournament-page">
      <div className="add-tournament-card">
        <div className="add-tournament-header">
          <h2>Create Tournament</h2>
        </div>

        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mb-3">
            Failed to create tournament. Please try again.
          </Alert>
        )}

        <Form className="add-tournament-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="tournamentName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter tournament name"
              value={tournamentData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="tournamentGame">
            <Form.Label>Game</Form.Label>
            <Form.Control
              type="text"
              name="game"
              placeholder="Enter game name"
              value={tournamentData.game}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="tournamentDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={tournamentData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="tournamentStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={tournamentData.status}
              onChange={handleChange}
              required
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>

          <Button
            className="add-tournament-btn"
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Tournament'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AddTournament;