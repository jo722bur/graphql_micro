// App.js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.client = new ApolloClient({
            uri: 'http://localhost:3000/graphql'
        });
        this.state = {
            query: ''
        }

    }
    setQuery(e) {

        this.setState({
            query: e.target.value
        })

    }

    sendQ(e) {
        console.log('query state: ', this.state)
        e.preventDefault();
        this.client.query({
            query: gql`${this.state.query}`,
        })
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    render() {
        return (
            <div>
            <textarea onChange={(e) => this.setQuery(e)}>
            </textarea>
                <button onClick={(e) => this.sendQ(e)}> send </button>
            </div>
                )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
