import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import typeDefs from "./schema";
import resolvers from "./resolvers";

const pubsub = new PubSub();
const prisma = new PrismaClient();

export interface Context {
  pubsub: PubSub;
  prisma: PrismaClient;
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: { pubsub, prisma } as Context,
});

export default server;
