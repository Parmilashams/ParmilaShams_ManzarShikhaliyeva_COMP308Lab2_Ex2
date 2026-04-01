import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const GET_TOURNAMENTS = gql`
  query GetTournaments {
    tournaments {
      id
      name
      game
      date
      status
    }
  }
`;

const UPDATE_TOURNAMENT = gql`
  mutation UpdateTournament(
    $id: ID!
    $name: String!
    $game: String!
    $date: String!
    $status: String!
  ) {
    updateTournament(
      id: $id
      name: $name
      game: $game
      date: $date
      status: $status
    ) {
      id
      name
      game
      date
      status
    }
  }
`;

function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState({
    name: '',
    game: '',
    date: '',
    status: 'Upcoming',
  });

  const [notFound, setNotFound] = useState(false);

  const { loading, error, data } = useQuery(GET_TOURNAMENTS);
  const [updateTournament, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_TOURNAMENT);

  useEffect(() => {
    if (data && data.tournaments) {
      const selectedTournament = data.tournaments.find(
        (item) => item.id === id
      );

      if (selectedTournament) {
        setTournament({
          name: selectedTournament.name,
          game: selectedTournament.game,
          date: selectedTournament.date
            ? selectedTournament.date.substring(0, 10)
            : '',
          status: selectedTournament.status,
        });
      } else {
        setNotFound(true);
      }
    }
  }, [data, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTournament({
      ...tournament,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateTournament({
        variables: {
          id,
          name: tournament.name,
          game: tournament.game,
          date: tournament.date,
          status: tournament.status,
        },
      });

      navigate('/tournaments');
    } catch (err) {
      console.log('Update error:', err.message);
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
      <Alert variant="danger">
        Error loading tournament data.
      </Alert>
    );
  }

  if (notFound) {
    return (
      <Alert variant="warning">
        Tournament not found.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Edit Tournament</h2>

      {updateError && (
        <Alert variant="danger">
          Error updating tournament.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTournamentName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={tournament.name}
            onChange={handleChange}
            placeholder="Enter tournament name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGame">
          <Form.Label>Game</Form.Label>
          <Form.Control
            type="text"
            name="game"
            value={tournament.game}
            onChange={handleChange}
            placeholder="Enter game name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={tournament.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={tournament.status}
            onChange={handleChange}
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" disabled={updateLoading}>
          {updateLoading ? 'Updating...' : 'Update Tournament'}
        </Button>
      </Form>
    </div>
  );
}

export default EditTournament;