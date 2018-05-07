const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');


const {weaver} = require('./src/weave');
const {apollo, apolloNoStitch} = require('./src/apollo');

const jwt = require('express-jwt');
const app = express();


const endpoints = [
    'http://localhost:4445/graphql', // User service
    'http://localhost:4444/graphql', // Page service
    'http://localhost:4446/graphql'  // personal messages
];

const startGateway = (schema) => {
    app.use('/graphql', jwt({
        secret: 'my-secret',
        requestProperty: 'auth',
        credentialsRequired: false,
    }));
    app.use('/graphql',
        graphqlHTTP(request => ({
            schema: schema,
            graphiql: true,
            context: request
        })));
    app.listen(3000, () => console.log('Gateway on 3000'));
};

/* weaver for simple schema stitching with DataLoader*/
// weaver(endpoints).then(schema => startGateway(schema));

/* apollo for sophisticated schema manipulation and authorization */
apollo(endpoints).then(schema => startGateway(schema));

/* No Sitch for resilient gateway */
// apolloNoStitch(endpoints).then(schema => startGateway(schema));
