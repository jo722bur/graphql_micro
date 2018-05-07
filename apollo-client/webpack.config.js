var path = require('path');


module.exports = {
    entry: ['./app.jsx'],
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/public/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.*jsx/,
                exclude: '/node_modules/',
                loader: 'babel-loader'
            }
        ]
    },

};