# GraphQL demo

This project contains [Express](https://expressjs.com/) hello world app.

## Install GraphQL tooling

```bash
npm i apollo-server-express
```

## Add sampel GraphQL app

```js
const { ApolloServer, gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Message {
    ID: ID!
    title: String!
    body: String
  }

  type Query {
    messages: [Message]
  }
  type Mutation {
    addMessage(title: String!, body: String): Message
  }
`;

// var to save the message
const messages = [];
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    messages: () => {
      return [...messages].reverse();
    }
  },
  Mutation: {
    addMessage: (root, message) => {
      message.ID = messages.length;
      messages.push(message);
      return message;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/graphql" });
```

## Add optional limit parameter to messages query

```graphql
type Query {
  messages(limit: Int = 3): [Message]
}
```

```js
  Query: {
    messages: (root, params) => {
      return [...messages].reverse().slice(0, params.limit);
    }
  },
```

## Add field argument

```graphql
type Message {
  ID: ID!
  title: String!
  body(trim: Int): String
}
```

```js
Message: {
  body: (root, params) => {
    if (!root.body || !params.trim || root.body.length < params.trim) {
      return root.body;
    }
    return root.body.substr(0, params.trim) + "...";
  };
}
```

# Add comments for schema

```graphql
"""
object to describe the message
"""
type Message {
  " message id"
  ID: ID!
  " message title"
  title: String!
  " message body"
  body(" trim post after x characters" trim: Int): String
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
```
