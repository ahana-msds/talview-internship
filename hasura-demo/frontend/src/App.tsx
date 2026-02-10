
import { ApolloProvider } from '@apollo/client/react';
import { client } from './apollo/client';
import { TodoList } from './components/TodoList';
import { Auth } from './components/Auth';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Hasura GraphQL Demo</h1>
        <p>Demonstrating Real-time Subscriptions, Queries, Mutations, and Access Control.</p>

        <Auth />
        <hr />
        <TodoList />
      </div>
    </ApolloProvider>
  );
}

export default App;
