const {buildSchema} = require('graphql');
const userData = require('../resource/userData.json');
const http = require('axios');

const fs = require('fs');

const schema = buildSchema(`
    
    type Query { 
       "retrieve single user information"
       user(id: Int!): User!
       "retrieve many users"
       users(id: [Int]): [User]
       userFromREST(id: ID): User
    }
        
    type User {
        userID: ID!
        name: String!
        email: String!
        profilePage: String
        image: String
     }
`);

class User {
    constructor(obj) {
        this.userID = obj.userID;
        this.name = obj.name;
        this.email = obj.email;
        this.profilePage = obj.profilePage;
    }

    image() {
        console.log('oi');

        let pr = new Promise((res, rej) => {
            fs.readFile('./resource/default.png', (error, data) => res(new Buffer(data, 'base64')));
        })

        return pr.then(r => r)
    }


}


const resolver = {
    user: ({id}, context) => getUserByID(id, context),
    users: ({id}) => getUsersByID(id),
    userFromREST: ({id}) => getUserFromREST(id)
};

//////// retrieval logic //////////
function getUserByID(id, context) {
    console.log('calling userservice GraphQL with id', id);
    let found = userData.filter(p => p.userID === parseInt(id));
    if (found.length === 0) {
        context.res.status(404);
        throw new Error('User Not Found');
    }
    return new User(found[0])
}

function getUsersByID(id) {
    console.log('Userservice : users(', id, ')');
    const idsToInt = id.map(x => parseInt(x));
    let found = userData.filter(p => idsToInt.includes(p.userID));
    return found
}

function getUserFromREST(id) {
    return http.get(`http://localhost:4445/api/v1/user/${id}`)
        .then(response => response.data)
        .catch(error => new Error('User Not Found'))
}


module.exports = {schema, resolver};

