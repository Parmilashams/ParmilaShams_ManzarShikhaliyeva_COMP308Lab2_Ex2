import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type Player {
    id: ID!
    user: User!
    ranking: Int!
    tournaments: [Tournament]
    createdAt: String
    updatedAt: String
  }

  type Tournament {
    id: ID!
    name: String!
    game: String!
    date: String!
    players: [Player]
    status: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    message: String!
    user: User
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    players: [Player]
    tournaments: [Tournament]
    upcomingTournaments: [Tournament]
    myTournamentHistory: [Tournament]
    me: User
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      role: String
    ): AuthPayload

    login(
      email: String!
      password: String!
    ): AuthPayload

    logout: AuthPayload

    createUser(
      username: String!
      email: String!
      password: String!
      role: String!
    ): User

    updateUser(
      id: ID!
      username: String!
      email: String!
      role: String!
    ): User

    deleteUser(id: ID!): String

    createTournament(
      name: String!
      game: String!
      date: String!
      status: String
    ): Tournament

    updateTournament(
      id: ID!
      name: String!
      game: String!
      date: String!
      status: String!
    ): Tournament

    deleteTournament(id: ID!): String

    joinTournament(
      tournamentId: ID!
    ): Player

    assignPlayerToTournament(
      playerId: ID!
      tournamentId: ID!
    ): Tournament
  }
`;

export default typeDefs;