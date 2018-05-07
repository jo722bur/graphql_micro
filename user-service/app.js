const express = require('express');
const expressGraphQL = require('express-graphql');

const {schema, resolver} = require('./src/buildSchema');
const app = express();


app.use('/', require('./src/restRoutes'));
app.use('/graphql', expressGraphQL({
    schema: schema,
    rootValue: resolver,
    graphiql: true
}));




app.listen(4445, console.log('UserService on port 4445'));
