import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

/**
 * Apollo Client Configuration
 * This setup enables both HTTP (Queries/Mutations) and WebSocket (Subscriptions) connections.
 * It also injects authentication headers to simulate role-based access control.
 */

const HASURA_GRAPHQL_ENDPOINT = 'http://localhost:8080/v1/graphql';
const HASURA_WS_ENDPOINT = 'ws://localhost:8080/v1/graphql';

// 1. HTTP Link for Queries and Mutations
const httpLink = new HttpLink({
    uri: HASURA_GRAPHQL_ENDPOINT,
});

// 2. Auth Link to inject headers
const authLink = setContext((_, { headers }) => {
    // Get the role and user ID from local storage (Simulating auth)
    const role = localStorage.getItem('role') || 'user';
    const userId = localStorage.getItem('userId') || '1';

    return {
        headers: {
            ...headers,
            'x-hasura-admin-secret': 'myadminsecretkey', // In a real app, use JWT tokens instead!
            'x-hasura-role': role,
            'x-hasura-user-id': userId,
        }
    }
});

// 3. Modern WebSocket Link for Subscriptions (using graphql-ws)
const wsLink = new GraphQLWsLink(createClient({
    url: HASURA_WS_ENDPOINT,
    connectionParams: {
        headers: {
            'x-hasura-admin-secret': 'myadminsecretkey',
            'x-hasura-role': localStorage.getItem('role') || 'user',
            'x-hasura-user-id': localStorage.getItem('userId') || '1',
        },
    },
}));

// 4. Split Link: Routes traffic based on operation type
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink),
);

// 5. Initialize Client
export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
