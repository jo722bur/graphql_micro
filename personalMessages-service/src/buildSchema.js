var {buildSchema} = require('graphql');
const testdata = require('../resource/testdata.json');

const schema = buildSchema(`
    
    ## root Query
    type Query { 
       personalMessages(userID: Int!): PersonalMessages!
    }
    
    type Mutation {
       " send out a message of type 'personal' "
       sendPersonalMessage(from: Int!, to: Int!, content: String!): Boolean!
       recommendPage(to: Int!, content: String!, page: Int!): Boolean!
    }
 
     type PersonalMessages {   
        userID: Int
        messageCount: Int!
        "Type = 'personal' OR 'recommendation'"
        messages(type: String): [Message]
     }

     type Message {
        content: String
        type: String
        date: Date
        from: Int
        recommendedPage: Int
     }
     scalar Date
     
     enum MessageType {
          recommendation
          personal
     }
`);

class PersonalMessages {
    constructor(pm) {
        this.pm = pm;
        this.userID = pm.userID;
        this.messageCount = pm.messages.length
    }

    messages(input) {
        let allMessages = this.pm.messages.map(m => new Message(m));
        if (input.type) {
            allMessages = allMessages.filter(mess => mess.type === input.type);
        }
        return allMessages;
    }
}

class Message {
    constructor(m) {
        console.log(m)
        this.content = m.content;
        this.type = m.type;
        this.date = new Date(m.date);
        this.from = m.fromUser || m.from;
        this.recommendedPage = m.recommendedPage;
    }
}

var resolver = {
    personalMessages: ({userID}, context, r) => personalMessages(userID),
    sendPersonalMessage: ({from, to, content}) => sendPersonalMessage(from, to, content),
    recommendPage: ({to, content, recommendedPage}) => recommendPage(to, content, recommendedPage)
};


function personalMessages(userID) {
    console.log('Personal Message with id', userID);
    let a = testdata.filter(p => p.userID === userID);
    return new PersonalMessages(a[0])
}

function sendPersonalMessage(from, to, content) {
    let user = testdata.find(p => p.userID === to);
    if (!user) return new Error('User nor found');
    user.messages.push({
        content: content,
        date: new Date(),
        from: from,
        type: "personal"
    });
    return true
}

function recommendPage(to, content, recommendedPage) {
    let a = testdata.filter(p => p.userID === to);
    a[0].messages.push({
        content: content,
        date: new Date(),
        from: 1,
        type: "recommendation",
        recommendedPage: recommendedPage
    });
    return true
}

module.exports = {schema, resolver};
