const {mergeSchemas, makeRemoteExecutableSchema, introspectSchema} = require('graphql-tools');
const fetch = require('node-fetch');
const {HttpLink} = require('apollo-link-http');
const {setContext} = require('apollo-link-context');


async function getIntrospectSchema(url) {

    // Create a link to a GraphQL instance by passing fetch instance and url
    const http = new HttpLink({uri: url, fetch});

    const link = setContext((request, previousContext) => ({
        headers: {
            'Authentication': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.EpM5XBzTJZ4J8AfoJEcJrjth8pfH28LWdjLo90sYb9g",
        }
    })).concat(http);

    try {
        const schema = await introspectSchema(link);
        return makeRemoteExecutableSchema({schema, link,});
    } catch (e) {
        console.log(e)
    }
}

async function apolloNoStitch(endpoints) {
    const allSchemas = await Promise.all(endpoints.map(ep => getIntrospectSchema(ep)));
    return mergeSchemas({
        schemas: allSchemas
    })

}


async function apollo(endpoints) {
    const allSchemas = await Promise.all(endpoints.map(ep => getIntrospectSchema(ep)));
    const linkSchemas = `
            extend type Page {
                authorFromUserService: User
            }
            
            extend type Message  {
                from_UserService: User
                recommendedPage_PageService: Page
            }       
        `;
    return mergeSchemas({
        schemas: [...allSchemas, linkSchemas],
        resolvers: mergeInfo => ({
            Page: {
                authorFromUserService: {
                    fragment: `fragment ExtendedUser on Page { author }`,
                    resolve: (p, a, c, i) => {
                        return mergeInfo.delegate('query', 'user', {id: p.author}, c, i)
                    }
                }
            },
            Message: {
                from_UserService: {
                    fragment: `fragment ExtendedUser on Message { from }`,
                    resolve: (parent, args, context, info) => {
                        return mergeInfo.delegate('query', 'user', {id: parent.from}, context, info);
                    }
                },
                recommendedPage_PageService: {
                    fragment: `fragment ExtendPage on Message { recommendedPage }`,
                    resolve: (parent, args, context, info) => {
                        return mergeInfo.delegate('query', 'getPage', {id: parent.recommendedPage}, context, info);
                    }
                }
            }
        })
    });

}

module.exports = {apollo, apolloNoStitch};
