import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const GET_TOURNAMENTS = gql`
  query GetTournaments {
    tournaments {
      id
      name
      game
      status
    }
  }
`;

const JOIN_TOURNAMENT = gql`
  mutation JoinTournament($tournamentId: ID!) {
    joinTournament(tournamentId: $tournamentId) {
      id
      ranking
      tournaments {
        id
        name
      }
      user {
        id
        username
      }
    }
  }
`;

function JoinTournament() {
  const [tournamentId, setTournamentId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const { loading, error, data } = useQuery(GET_TOURNAMENTS);

  const [joinTournament, { data: joinData, loading: joinLoading, error: joinError }] =
    useMutation(JOIN_TOURNAMENT);

  const selectedTournament = data?.tournaments?.find(
    (tournament) => tournament.id === tournamentId
  );

  const handleTournamentChange = (e) => {
    const selectedId = e.target.value;
    setTournamentId(selectedId);
    setSuccessMessage('');
    setWarningMessage('');

    const tournament = data?.tournaments?.find((t) => t.id === selectedId);

    if (tournament && tournament.status !== 'Upcoming') {
      setWarningMessage(
        `You cannot join "${tournament.name}" because it is ${tournament.status.toLowerCase()}. Only upcoming tournaments can be joined.`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setWarningMessage('');

    if (!selectedTournament) {
      setWarningMessage('Please select a tournament.');
      return;
    }

    if (selectedTournament.status !== 'Upcoming') {
      setWarningMessage(
        `You cannot join "${selectedTournament.name}" because it is ${selectedTournament.status.toLowerCase()}. Only upcoming tournaments can be joined.`
      );
      return;
    }

    try {
      const result = await joinTournament({
        variables: {
          tournamentId,
        },
      });

      if (result.data.joinTournament) {
        setSuccessMessage('Joined tournament successfully.');
      }
    } catch (err) {
      console.log('Join tournament error:', err.message);
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
        Error loading tournaments.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Join Tournament</h2>

      {joinError && (
        <Alert variant="danger" role="alert">
          {joinError.message}
        </Alert>
      )}

      {warningMessage && (
        <Alert variant="warning" role="alert">
          {warningMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" role="alert">
          {successMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} aria-label="Join tournament form">
        <Form.Group className="mb-3" controlId="formTournamentSelect">
          <Form.Label>Select Tournament</Form.Label>
          <Form.Select
            value={tournamentId}
            onChange={handleTournamentChange}
            aria-label="Select tournament"
            required
          >
            <option value="">Select tournament</option>
            {data.tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name} - {tournament.game} ({tournament.status})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button
          type="submit"
          disabled={joinLoading || !tournamentId || selectedTournament?.status !== 'Upcoming'}
          aria-label="Join selected tournament"
          aria-busy={joinLoading}
        >
          {joinLoading ? 'Joining...' : 'Join Tournament'}
        </Button>
      </Form>

      {joinData && joinData.joinTournament && (
        <div className="mt-4">
          <p>
            <strong>Player:</strong> {joinData.joinTournament.user.username}
          </p>
          <p>
            <strong>Total Joined Tournaments:</strong>{' '}
            {joinData.joinTournament.tournaments.length}
          </p>
        </div>
      )}

      <h3 className="mt-4">Tournaments You Can View</h3>

      <Table striped bordered hover responsive aria-label="Available tournaments table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Game</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.tournaments.map((tournament) => (
            <tr key={tournament.id}>
              <td>{tournament.name}</td>
              <td>{tournament.game}</td>
              <td>{tournament.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default JoinTournament;