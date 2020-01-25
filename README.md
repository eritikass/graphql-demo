# GraphQL demo

This project contains [Express](https://expressjs.com/) hello world app.

## Install GraphQL tooling

```bash
npm i graphql express-graphql
```

## Define schema

```graphql
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
```

## Add GraphQL serve code

```js
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const messages = [];
const root = {
  messages: () => {
    return [...messages].reverse();
  },
  addMessage: (message) => {
    message.ID = messages.length;
    messages.push(message);
    return message;
  }
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: root,
    graphiql: true,
  }),
);
```

## Add optional limit parameter to messages query


```graphql
  type Query {
    messages(limit: Int = 3): [Message]
  }
```

```
  messages: (params) => {
    return [...messages].reverse().slice(0, params.limit);
  },
```
