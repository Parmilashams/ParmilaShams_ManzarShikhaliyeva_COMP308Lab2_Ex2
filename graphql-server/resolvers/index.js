import userResolvers from "./user.resolvers.js";
import playerResolvers from "./player.resolvers.js";
import tournamentResolvers from "./tournament.resolvers.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...playerResolvers.Query,
    ...tournamentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...playerResolvers.Mutation,
    ...tournamentResolvers.Mutation,
  },
};

export default resolvers;