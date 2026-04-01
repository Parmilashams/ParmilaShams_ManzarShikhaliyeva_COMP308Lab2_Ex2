import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

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

const ME = gql`
  query Me {
    me {
      id
      username
      email
      role
    }
  }
`;

const DELETE_TOURNAMENT = gql`
  mutation DeleteTournament($id: ID!) {
    deleteTournament(id: $id)
  }
`;

function TournamentList() {
  const [statusFilter, setStatusFilter] = useState('All');

  const { loading, error, data, refetch } = useQuery(GET_TOURNAMENTS);

  const { data: meData } = useQuery(ME, {
    fetchPolicy: 'network-only',
  });

  const [deleteTournament] = useMutation(DELETE_TOURNAMENT);

  const user = meData?.me || null;
  const userRole = user?.role?.trim().toLowerCase() || '';

  const formatDate = (dateValue) => {
    if (!dateValue) return 'No Date';

    const numericDate = Number(dateValue);
    const date = isNaN(numericDate) ? new Date(dateValue) : new Date(numericDate);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this tournament?'
    );

    if (!confirmDelete) return;

    try {
      await deleteTournament({
        variables: { id },
      });
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredTournaments = (data?.tournaments || []).filter((tournament) => {
    if (statusFilter === 'All') return true;

    return (
      tournament.status &&
      tournament.status.trim().toLowerCase() ===
        statusFilter.trim().toLowerCase()
    );
  });

  const getTournamentNote = () => {
    if (!user) {
      return 'Guest users can browse tournaments here. To join a tournament, please log in or register as a player.';
    }

    if (userRole === 'admin') {
      return 'Admins can browse tournaments here and manage tournament assignments from the Players page.';
    }

    return 'You can browse available tournaments here and join from the Join Tournament page.';
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
    <div className="tournaments-page">
      <div className="tournaments-container">
        <div className="tournaments-header">
          <h1 className="tournaments-title">All Tournaments</h1>
          <p className="tournaments-subtitle">
            Browse upcoming, ongoing, and completed tournaments.
          </p>
        </div>

        <div className="tournaments-card">
          <div className="tournaments-topbar">
            <div className="tournaments-filter">
              <label htmlFor="statusFilter">Filter by status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="tournaments-actions">
              <button
                type="button"
                className="refresh-btn"
                onClick={() => refetch()}
              >
                Refresh
              </button>

              {!user && (
                <Link to="/login" className="login-btn text-decoration-none">
                  Login to Join
                </Link>
              )}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="tournaments-table">
              <thead>
                <tr>
                  <th>Tournament</th>
                  <th>Game</th>
                  <th>Date</th>
                  <th>Status</th>
                  {userRole === 'admin' && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredTournaments.length > 0 ? (
                  filteredTournaments.map((tournament) => (
                    <tr key={tournament.id}>
                      <td>{tournament.name}</td>
                      <td>{tournament.game}</td>
                      <td>{formatDate(tournament.date)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            tournament.status?.trim().toLowerCase() === 'upcoming'
                              ? 'status-upcoming'
                              : tournament.status?.trim().toLowerCase() === 'ongoing'
                              ? 'status-ongoing'
                              : 'status-completed'
                          }`}
                        >
                          {tournament.status}
                        </span>
                      </td>

                      {userRole === 'admin' && (
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/edit-tournament/${tournament.id}`}
                              className="edit-btn text-decoration-none"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleDelete(tournament.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={userRole === 'admin' ? 5 : 4}
                      className="empty-state"
                    >
                      No tournaments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tournaments-note">
            {getTournamentNote()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentList;