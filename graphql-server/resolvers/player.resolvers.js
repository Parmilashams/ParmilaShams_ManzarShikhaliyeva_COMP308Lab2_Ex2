import Player from "../models/Player.js";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js";

const playerResolvers = {
  Query: {
    players: async (_, __, context) => {
      try {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Unauthorized");
        }

        const players = await Player.find()
          .populate("user")
          .populate("tournaments");

        return players;
      } catch (error) {
        console.error("Error fetching players:", error);
        throw new Error(error.message || "Failed to fetch players");
      }
    },

    myTournamentHistory: async (_, __, context) => {
      try {
        if (!context.user || context.user.role !== "Player") {
          throw new Error("Unauthorized");
        }

        const player = await Player.findOne({ user: context.user.id }).populate("tournaments");

        if (!player) {
          return [];
        }

        return player.tournaments || [];
      } catch (error) {
        console.error("Error fetching tournament history:", error);
        throw new Error(error.message || "Failed to fetch tournament history");
      }
    },
  },

  Mutation: {
    joinTournament: async (_, { tournamentId }, context) => {
      try {
        if (!context.user || context.user.role !== "Player") {
          throw new Error("Unauthorized");
        }

        const user = await User.findById(context.user.id);

        if (!user) {
          throw new Error("User not found");
        }

        let player = await Player.findOne({ user: context.user.id });

        if (!player) {
          player = new Player({
            user: context.user.id,
            ranking: 0,
            tournaments: [],
          });
          await player.save();
        }

        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
          throw new Error("Tournament not found");
        }

        const alreadyJoinedPlayer = player.tournaments.some(
          (item) => item.toString() === tournamentId
        );

        if (alreadyJoinedPlayer) {
          throw new Error("Player already joined this tournament");
        }

        const alreadyInTournament = tournament.players.some(
          (item) => item.toString() === player._id.toString()
        );

        if (alreadyInTournament) {
          throw new Error("Player already exists in this tournament");
        }

        player.tournaments.push(tournament._id);
        await player.save();

        tournament.players.push(player._id);
        await tournament.save();

        const updatedPlayer = await Player.findById(player._id)
          .populate("user")
          .populate("tournaments");

        return updatedPlayer;
      } catch (error) {
        console.error("Error joining tournament:", error);
        throw new Error(error.message || "Failed to join tournament");
      }
    },
  },
};

export default playerResolvers;