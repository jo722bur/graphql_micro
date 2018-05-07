const {buildSchema} = require('graphql');
const pageData = require('../resource/testdata.json');

const schema = buildSchema(`
    
    type Query { 
       getPage(id: Int): Page!
    }
     type Page {   
        ID: ID!
        title: String
        author: Int!
        link: String
     }   
`);

class Page {
    constructor(data) {
        this.ID = data.pageID;
        this.title = data.pageTitle;
        this.author = data.author;
        this.link = data.self.url;
    }
}

var resolver = {
    getPage: ({id}) => {
        console.log('calling page service with id:', id)
        let a = pageData.filter(p => p.pageID === id);
        return new Page(a[0])
    }
};

module.exports = {schema, resolver};
