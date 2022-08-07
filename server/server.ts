import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient, Todo } from "@prisma/client";
import { Props } from "graphql-yoga/dist/types";

const pubsub = new PubSub();
const prisma = new PrismaClient();

interface Context {
  pubsub: PubSub;
  prisma: PrismaClient;
}

interface Cursor {
  id: string;
  x: number;
  y: number;
}

interface State {
  cursors: Cursor[];
  todos: Todo[];
}

const typeDefs = `
  type Todo {
    id: ID!
    text: String!
    is_completed: Boolean!
    order: Int!
  }
  type Cursor {
    id: ID!
    x: Int!
    y: Int!
  }
  input CursorInput {
    id: ID!
    x: Int!
    y: Int!
  }
  type State {
    todos: [Todo!]
    cursors: [Cursor!]
  }
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(text: String!): ID!
    addCursor(c: CursorInput!): ID!
    updateCursor(c: CursorInput!): ID!
  }
  type Subscription {
    state: State
  }
`;

const state: State = {
  todos: [],
  cursors: [],
};

const subscribers: (() => void)[] = [];
const onStateUpdates = (fn: () => void) => subscribers.push(fn);

const generateChannelID = () => Math.random().toString(36).slice(2, 15);

const spreadState = () => subscribers.forEach((fn) => fn());

const resolvers = {
  Query: {
    todos: () => state.todos,
  },
  Mutation: {
    addTodo: (_: any, { text }: { text: string }) => {
      const id = String(state.todos.length);
      state.todos.push({
        id,
        text,
        is_completed: false,
        order: state.todos.length,
        created_at: new Date(),
        updated_at: new Date(),
      });
      spreadState();
      return id;
    },
    addCursor: (_: any, args: Cursor) => {
      state.cursors.push(args);
      spreadState();
      return args.id;
    },
    updateCursor: (_: any, args: Cursor) => {
      const newCursors = state.cursors.map((c) => {
        if (c.id === args.id) {
          return {
            ...c,
            x: args.x,
            y: args.y,
          };
        }
        return c;
      });
      state.cursors = newCursors;
      spreadState();
      return args.id;
    },
  },
  Subscription: {
    state: {
      subscribe: (
        _: any,
        _args: any,
        { pubsub }: { pubsub: Context["pubsub"] }
      ) => {
        const channel = generateChannelID();

        onStateUpdates(() => pubsub.publish(channel, state));
        setTimeout(() => pubsub.publish(channel, state), 0);

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
