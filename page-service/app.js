const express = require('express');
const graphqlHTTP = require('express-graphql');
const {schema, resolver} = require('./src/buildSchema');
const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true
}));

app.listen(4444, () => console.log('Page Service stated -> localhost:4444/graphql'));
