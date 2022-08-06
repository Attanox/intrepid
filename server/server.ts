import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient, Todo } from "@prisma/client";
import { Props } from "graphql-yoga/dist/types";

const todos: Todo[] = [];

const pubsub = new PubSub();
const prisma = new PrismaClient();

interface Context {
  pubsub: PubSub;
  prisma: PrismaClient;
}

const typeDefs = `
  type Todo {
    id: ID!
    text: String!
    is_completed: Boolean!
    order: Int!
  }
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(text: String!): ID!
  }
  type Subscription {
    todos: [Todo!]
  }
`;

const subscribers: (() => void)[] = [];
const onTodosUpdates = (fn: () => void) => subscribers.push(fn);

const generateChannelID = () => Math.random().toString(36).slice(2, 15);

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    addTodo: (_: any, { text }: { text: string }) => {
      const id = String(todos.length);
      todos.push({
        id,
        text,
        is_completed: false,
        order: todos.length,
        created_at: new Date(),
        updated_at: new Date(),
      });
      subscribers.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    todos: {
      subscribe: (
        _: any,
        _args: any,
        { pubsub }: { pubsub: Context["pubsub"] }
      ) => {
        const channel = generateChannelID();

        onTodosUpdates(() => pubsub.publish(channel, { todos }));
        setTimeout(() => pubsub.publish(channel, { todos }), 0);

        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: { pubsub, prisma } as Context,
} as Props<any, any, Context>);
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
