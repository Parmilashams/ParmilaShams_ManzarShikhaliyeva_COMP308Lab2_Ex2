import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./resolvers/index.js";

const app = express();
const httpServer = http.createServer(app);

await mongoose.connect(process.env.MONGO_URI);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/graphql",
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req, res }) => {
      let user = null;
      const token = req.cookies?.token;

      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          user = null;
        }
      }

      return { req, res, user };
    },
  })
);

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000/graphql");
});