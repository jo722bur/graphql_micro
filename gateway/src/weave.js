const {weaveSchemas} = require('graphql-weaver');

async function weaver(endpoints) {

    return await weaveSchemas({
        endpoints: [
            {
                //namespace: 'UserService',
                url: endpoints[0], //UserService
            },
            {
                //namespace: 'PageService',
                url: endpoints[1],
                fieldMetadata: {
                    'Page.author': {
                        link: {
                            field: 'user',
                            argument: 'id',
                            batchMode: false
                        }
                    },
                }
            },
            {
                //namespace: 'Personal Messages',
                url: endpoints[2],
                fieldMetadata: {
                    'Message.fromUser': {
                        link: {
                            field: 'users',
                            argument: 'id',
                            batchMode: true,
                        }
                    },
                    'Message.recommendedPage': {
                        link: {
                            field: 'getPage',
                            argument: 'id',
                            batchMode: false
                        }
                    }
                }
            }
        ]
    });
}
module.exports = {weaver};