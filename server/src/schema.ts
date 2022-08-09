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
  type Message {
    id: ID!
    user: String!
    content: String!
  }
  input CursorInput {
    id: ID!
    x: Float!
    y: Float!
  }
  type Query {
    cursors: [Cursor!]
    todos: [Todo!]
    messages: [Message!]
  }
  type Mutation {
    addTodo(text: String!): ID!
    updateCursor(c: CursorInput!): ID!
    postMessage(user: String!, content: String!): ID!
  }
  type Subscription {
    todos: [Todo!]
    cursors(c: CursorInput): [Cursor!]
    messages: [Message!]
  }
`;

export default typeDefs;