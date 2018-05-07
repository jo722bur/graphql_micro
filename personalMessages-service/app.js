const express = require('express');
const graphqlHTTP = require('express-graphql');
const {schema, resolver} = require('./src/buildSchema');

const app = express();

app.use('/graphql', graphqlHTTP( req => ({
    schema: schema,
    rootValue: resolver,
    context: req,
    graphiql: true
})));

app.use('/', require('./src/restRoutes'));

app.listen(4446, () => console.log('PersonalMessages Service Port 4446'));
