import { v4 as uuid } from "uuid";
import type { Todo } from "@prisma/client";
import type { Context } from "./server";

interface Cursor {
  id: string;
  x: number;
  y: number;
}

interface Message {
  id: string;
  user: string;
  content: string;
}

const cursors: { [id: string]: Cursor } = {};
const todos: Todo[] = [];
const messages: Message[] = [];

const todosSubscribers: (() => void)[] = [];
const onTodosUpdates = (fn: () => void) => todosSubscribers.push(fn);
const spreadTodos = () => todosSubscribers.forEach((fn) => fn());

const cursorsSubscribers: (() => void)[] = [];
const onCursorsUpdates = (fn: () => void) => cursorsSubscribers.push(fn);
const spreadCursors = () => cursorsSubscribers.forEach((fn) => fn());

const messagesSubscribers: (() => void)[] = [];
const onMessagesUpdates = (fn: () => void) => messagesSubscribers.push(fn);
const spreadMessages = () => messagesSubscribers.forEach((fn) => fn());

const generateChannelID = () => Math.random().toString(36).slice(2, 15);

const resolvers = {
  Query: {
    cursors: () => cursors,
    todos: () => todos,
    messages: () => messages,
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
    postMessage: (
      _: any,
      { user, content }: { user: string; content: string }
    ) => {
      const id = uuid();

      messages.push({
        id,
        user,
        content,
      });

      spreadMessages();
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

        onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);

        return pubsub.asyncIterator(channel);
      },
    },
  },
};

export default resolvers;
