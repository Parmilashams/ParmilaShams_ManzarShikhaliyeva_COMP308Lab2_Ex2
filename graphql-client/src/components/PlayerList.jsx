import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      ranking
      user {
        username
        email
      }
    }
  }
`;

const GET_TOURNAMENTS = gql`
  query GetTournaments {
    tournaments {
      id
      name
    }
  }
`;

const ASSIGN_PLAYER = gql`
  mutation AssignPlayer($playerId: ID!, $tournamentId: ID!) {
    assignPlayerToTournament(playerId: $playerId, tournamentId: $tournamentId) {
      id
      name
    }
  }
`;

function PlayerList() {
  const {
    loading: playersLoading,
    error: playersError,
    data: playersData,
    refetch,
  } = useQuery(GET_PLAYERS);

  const {
    loading: tournamentsLoading,
    error: tournamentsError,
    data: tournamentsData,
  } = useQuery(GET_TOURNAMENTS);

  const [assignPlayer, { error: assignError }] = useMutation(ASSIGN_PLAYER);

  const [tournamentId, setTournamentId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAssign = async (playerId) => {
    if (!tournamentId) {
      alert('Please select a tournament');
      return;
    }

    try {
      const result = await assignPlayer({
        variables: {
          playerId,
          tournamentId,
        },
      });

      if (result.data.assignPlayerToTournament) {
        setSuccessMessage('Player assigned to tournament successfully.');
      }
    } catch (err) {
      console.log('Assign player error:', err.message);
      setSuccessMessage('');
    }
  };

  if (playersLoading || tournamentsLoading) {
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (playersError) {
    return <Alert variant="danger">Error loading players.</Alert>;
  }

  if (tournamentsError) {
    return <Alert variant="danger">Error loading tournaments.</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Players</h2>

      {assignError && (
        <Alert variant="danger">
          Error assigning player to tournament.
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="formTournamentId">
        <Form.Label>Tournament Name</Form.Label>
        <Form.Select
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
        >
          <option value="">Select Tournament</option>
          {tournamentsData.tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Table striped bordered hover responsive aria-label="Player list table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Ranking</th>
            <th>Assign</th>
          </tr>
        </thead>

        <tbody>
          {playersData.players.map((player) => (
            <tr key={player.id}>
              <td>{player.user.username}</td>
              <td>{player.user.email}</td>
              <td>{player.ranking}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleAssign(player.id)}
                  aria-label={`Assign player ${player.user.username} to selected tournament`}
                >
                  Assign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="secondary" onClick={() => refetch()} aria-label="Refresh player list">
        Refresh
      </Button>
    </div>
  );
}

export default PlayerList;