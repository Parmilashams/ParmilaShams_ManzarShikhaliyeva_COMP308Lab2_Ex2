import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    ranking: {
      type: Number,
      default: 0,
      min: 0,
    },
    tournaments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;