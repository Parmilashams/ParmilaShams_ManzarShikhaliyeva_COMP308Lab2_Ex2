import Tournament from "../models/Tournament.js";
import Player from "../models/Player.js";

const tournamentResolvers = {
  Query: {
    tournaments: async () => {
      try {
        const tournaments = await Tournament.find().populate({
          path: "players",
          populate: {
            path: "user",
          },
        });

        return tournaments;
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        throw new Error("Failed to fetch tournaments");
      }
    },

    upcomingTournaments: async () => {
      try {
        const tournaments = await Tournament.find({ status: "Upcoming" }).populate({
          path: "players",
          populate: {
            path: "user",
          },
        });

        return tournaments;
      } catch (error) {
        console.error("Error fetching upcoming tournaments:", error);
        throw new Error("Failed to fetch upcoming tournaments");
      }
    },
  },

  Mutation: {
    createTournament: async (_, { name, game, date, status }, context) => {
      try {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Unauthorized");
        }

        const newTournament = new Tournament({
          name,
          game,
          date,
          status: status || "Upcoming",
          players: [],
        });

        const savedTournament = await newTournament.save();
        return savedTournament;
      } catch (error) {
        console.error("Error creating tournament:", error);
        throw new Error(error.message || "Failed to create tournament");
      }
    },

    updateTournament: async (_, { id, name, game, date, status }, context) => {
      try {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Unauthorized");
        }

        const updatedTournament = await Tournament.findByIdAndUpdate(
          id,
          {
            name,
            game,
            date,
            status,
          },
          { new: true }
        ).populate({
          path: "players",
          populate: {
            path: "user",
          },
        });

        if (!updatedTournament) {
          throw new Error("Tournament not found");
        }

        return updatedTournament;
      } catch (error) {
        console.error("Error updating tournament:", error);
        throw new Error(error.message || "Failed to update tournament");
      }
    },

    deleteTournament: async (_, { id }, context) => {
      try {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Unauthorized");
        }

        const tournament = await Tournament.findById(id);

        if (!tournament) {
          throw new Error("Tournament not found");
        }

        await Tournament.findByIdAndDelete(id);

        return "Tournament deleted successfully";
      } catch (error) {
        console.error("Error deleting tournament:", error);
        throw new Error(error.message || "Failed to delete tournament");
      }
    },

    assignPlayerToTournament: async (_, { playerId, tournamentId }, context) => {
      try {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Unauthorized");
        }

        const player = await Player.findById(playerId);

        if (!player) {
          throw new Error("Player not found");
        }

        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
          throw new Error("Tournament not found");
        }

        const playerAlreadyAssigned = player.tournaments.some(
          (item) => item.toString() === tournamentId
        );

        if (!playerAlreadyAssigned) {
          player.tournaments.push(tournament._id);
          await player.save();
        }

        const alreadyInTournament = tournament.players.some(
          (item) => item.toString() === player._id.toString()
        );

        if (!alreadyInTournament) {
          tournament.players.push(player._id);
          await tournament.save();
        }

        const updatedTournament = await Tournament.findById(tournament._id).populate({
          path: "players",
          populate: {
            path: "user",
          },
        });

        return updatedTournament;
      } catch (error) {
        console.error("Error assigning player to tournament:", error);
        throw new Error(error.message || "Failed to assign player to tournament");
      }
    },
  },
};

export default tournamentResolvers;