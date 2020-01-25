const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

// Construct a schema, using GraphQL schema language
const graphqlSchema = `
  type Message {
    ID: ID!
    title: String!
    body(trim: Int): String
  }

  type Query {
    messages(limit: Int = 3): [Message]
  }
  type Mutation {
    addMessage(title: String!, body: String): Message
  }
`;

const fieldResolver = {
  Message: {
    body: (a, b, c) => {
      console.log('body', a, b, c);
      return null;
    },
  }
}

const messages = [];
const root = {
  messages: params => {
    return [...messages].reverse().slice(0, params.limit);
  },
  addMessage: message => {
    message.ID = messages.length;
    messages.push(message);
    return message;
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(graphqlSchema),
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
