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

const typeDefs = `
  type Todo {
    id: ID!
    text: String!
    is_completed: Boolean!
    order: Int!
  }
  type Cursor {
    id: ID!
    x: Float!
    y: Float!
  }
  input CursorInput {
    id: ID!
    x: Float!
    y: Float!
  }
  type Query {
    cursors: [Cursor!]
    todos: [Todo!]
  }
  type Mutation {
    addTodo(text: String!): ID!
    updateCursor(c: CursorInput!): ID!
  }
  type Subscription {
    todos: [Todo!]
    cursors(c: CursorInput): [Cursor!]
  }
`;

const cursors: { [id: string]: Cursor } = {};
const todos: Todo[] = [];

const todosSubscribers: (() => void)[] = [];
const onTodosUpdates = (fn: () => void) => todosSubscribers.push(fn);
const spreadTodos = () => todosSubscribers.forEach((fn) => fn());

const cursorsSubscribers: (() => void)[] = [];
const onCursorsUpdates = (fn: () => void) => cursorsSubscribers.push(fn);
const spreadCursors = () => cursorsSubscribers.forEach((fn) => fn());

const generateChannelID = () => Math.random().toString(36).slice(2, 15);

const resolvers = {
  Query: {
    cursors: () => cursors,
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
      spreadTodos();
      return id;
    },
    updateCursor: (_: any, args: { c: Cursor }) => {
      if (!args?.c?.id) return "";

      cursors[args.c.id] = {
        ...cursors[args.c.id],
        ...args.c,
      };
      spreadCursors();
      return args.c.id;
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
    cursors: {
      subscribe: (
        _: any,
        args: { c: Cursor },
        { pubsub }: { pubsub: Context["pubsub"] }
      ) => {
        const channel = generateChannelID();

        if (!args.c.id) return;

        cursors[args.c.id] = { ...args.c };

        onCursorsUpdates(() =>
          pubsub.publish(channel, { cursors: [...Object.values(cursors)] })
        );
        setTimeout(
          () =>
            pubsub.publish(channel, {
              cursors: [...Object.values(cursors)],
            }),
          0
        );

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
