import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const HASURA_GRAPHQL_ENDPOINT = 'http://localhost:8080/v1/graphql';
const HASURA_WS_ENDPOINT = 'ws://localhost:8080/v1/graphql';

/**
 * Global Error Handler
 */
const errorLink = onError((err: any) => {
    const { graphQLErrors, networkError, operation } = err;
    if (graphQLErrors) {
        for (const error of graphQLErrors) {
            console.error(
                `[GraphQL Error] ${error.message} (Operation: ${operation.operationName})`
            );
        }
    }
    if (networkError) console.error(`[Network Error] ${networkError}`);
});

const httpLink = new HttpLink({
    uri: HASURA_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
    const rawRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const validRoles = ['manager', 'agent', 'customer'];

    if (!rawRole) return { headers };

    const role = rawRole.toLowerCase();
    if (!validRoles.includes(role)) {
        return { headers };
    }

    if (role && userId) {
        console.log(`[Apollo Auth] Sending headers: x-hasura-role=${role}, x-hasura-user-id=${userId}`);
    }

    return {
        headers: {
            ...headers,
            'x-hasura-admin-secret': 'myadminsecretkey',
            'x-hasura-role': role,
            'x-hasura-user-id': userId || '0',
        }
    };
});

const wsLink = new GraphQLWsLink(createClient({
    url: HASURA_WS_ENDPOINT,
    connectionParams: () => {
        const rawRole = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        const validRoles = ['manager', 'agent', 'customer'];

        if (!rawRole) return {};

        const role = rawRole.toLowerCase();
        if (!validRoles.includes(role)) {
            return {};
        }

        const params = {
            'x-hasura-admin-secret': 'myadminsecretkey',
            'x-hasura-role': role,
            'x-hasura-user-id': userId || '0',
        };
        return {
            headers: params,
            ...params
        };
    },
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    errorLink.concat(authLink.concat(httpLink)),
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
