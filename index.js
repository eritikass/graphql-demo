const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const app = express();
const port = 3000;

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  """
  object to describe the message
  """
  type Message {
    " message id"
    ID: ID!
    " message title"
    title: String!
    " message body"
    body(" trim post after x characters" trim: Int = 3): String
  }

  type Query {
    """
    get messages
    """
    messages(" limit of messages to show" limit: Int = 3): [Message]
  }
  type Mutation {
    """
    add messages
    """
    addMessage(
      " message title"
      title: String!
      " message body"
      body: String
    ): Message
  }
`;

// var to save the message
const messages = [];
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    messages: (root, params) => {
      return [...messages].reverse().slice(0, params.limit);
    }
  },
  Mutation: {
    addMessage: (root, message) => {
      message.ID = messages.length;
      messages.push(message);
      return message;
    }
  },
  Message: {
    body: (root, params) => {
      return root.body.substr(0, params.trim) + "...";
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/graphql" });

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
