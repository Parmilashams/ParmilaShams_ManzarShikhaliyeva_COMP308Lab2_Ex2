import React from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const GET_TOURNAMENT_HISTORY = gql`
  query MyTournamentHistory {
    myTournamentHistory {
      id
      name
      game
      date
      status
    }
  }
`;

function TournamentHistory() {
  const [getTournamentHistory, { loading, error, data }] = useLazyQuery(
    GET_TOURNAMENT_HISTORY
  );

  const handleLoadHistory = () => {
    getTournamentHistory();
  };

  const formatDate = (dateValue) => {
   if (!dateValue) return "No Date Available";

    const date = new Date(Number(dateValue));

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div>
      <h2 className="mb-4">Tournament History</h2>

      <Button
        onClick={handleLoadHistory}
        aria-label="View tournament history"
        aria-busy={loading}
      >
        View History
      </Button>

      {loading && (
        <div className="text-center mt-3">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-3" role="alert">
          Error loading history.
        </Alert>
      )}

      {data && data.myTournamentHistory.length === 0 && (
        <Alert variant="info" className="mt-3" role="alert">
          No tournament history found.
        </Alert>
      )}

      {data && data.myTournamentHistory.length > 0 && (
        <div className="mt-4">
          <Table striped bordered hover responsive aria-label="Tournament history table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Game</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.myTournamentHistory.map((tournament) => (
                <tr key={tournament.id}>
                  <td>{tournament.name}</td>
                  <td>{tournament.game}</td>
                  <td>{formatDate(tournament.date)}</td>
                  <td>{tournament.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default TournamentHistory;
