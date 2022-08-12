import { v4 as uuid } from "uuid";
import type { Context } from "./server";

interface Cursor {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Message {
  id: string;
  user: string;
  content: string;
}

const cursors: { [id: string]: Cursor } = {};
const messages: { [user: string]: Message } = {};

const todosSubscribers: (() => Promise<boolean>)[] = [];
const onTodosUpdates = (fn: () => Promise<boolean>) =>
  todosSubscribers.push(fn);
const spreadTodos = () => todosSubscribers.forEach(async (fn) => await fn());

const cursorsSubscribers: (() => void)[] = [];
const onCursorsUpdates = (fn: () => void) => cursorsSubscribers.push(fn);
const spreadCursors = () => cursorsSubscribers.forEach((fn) => fn());

const messagesSubscribers: (() => void)[] = [];
const onMessagesUpdates = (fn: () => void) => messagesSubscribers.push(fn);
const spreadMessages = () => messagesSubscribers.forEach((fn) => fn());

const generateChannelID = () => Math.random().toString(36).slice(2, 15);

const resolvers = {
  Query: {
    cursors: () => [...Object.values(cursors)],
    todos: async (
      _: any,
      _args: any,
      { prisma }: { prisma: Context["prisma"] }
    ) => await prisma.todo.findMany(),
    messages: () => [...Object.values(messages)],
  },
  Mutation: {
    addTodo: async (_: any, { text }: { text: string }, ctx: Context) => {
      const todos = await ctx.prisma.todo.findMany();

      const created = await ctx.prisma.todo.create({
        data: {
          text,
          is_completed: false,
          order: todos.length,
        },
      });

      spreadTodos();
      return created.id;
    },
    updateTodo: async (
      _: any,
      { id, is_completed }: { id: string; is_completed: boolean },
      ctx: Context
    ) => {
      await ctx.prisma.todo.update({
        where: {
          id,
        },
        data: {
          is_completed,
        },
      });

      spreadTodos();
      return id;
    },
    updateTodoAll: async (
      _: any,
      { is_completed }: { is_completed: boolean },
      ctx: Context
    ) => {
      await ctx.prisma.todo.updateMany({
        data: {
          is_completed,
        },
      });

      spreadTodos();

      return true;
    },
    deleteTodo: async (_: any, { id }: { id: string }, ctx: Context) => {
      await ctx.prisma.todo.delete({
        where: {
          id,
        },
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
    deleteCursor: (_: any, args: { id: string }) => {
      if (!args?.id) return "";

      delete cursors[args.id];
      spreadCursors();

      return args.id;
    },
    postMessage: (
      _: any,
      { user, content }: { user: string; content: string }
    ) => {
      const id = uuid();

      messages[user] = {
        id,
        user,
        content,
      };

      spreadMessages();
      return id;
    },
  },
  Subscription: {
    todos: {
      subscribe: async (_: any, _args: any, { pubsub, prisma }: Context) => {
        const channel = generateChannelID();

        const getTodos = async () => await prisma.todo.findMany();

        onTodosUpdates(async () =>
          pubsub.publish(channel, { todos: await getTodos() })
        );
        setTimeout(
          async () => pubsub.publish(channel, { todos: await getTodos() }),
          0
        );

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
    messages: {
      subscribe: (
        _: any,
        _args: any,
        { pubsub }: { pubsub: Context["pubsub"] }
      ) => {
        const channel = generateChannelID();

        onMessagesUpdates(() =>
          pubsub.publish(channel, { messages: [...Object.values(messages)] })
        );
        setTimeout(
          () =>
            pubsub.publish(channel, { messages: [...Object.values(messages)] }),
          0
        );

        return pubsub.asyncIterator(channel);
      },
    },
  },
};

export default resolvers;
