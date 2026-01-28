import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    projects: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                    tasks: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
            User: {
                fields: {
                    projects: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
});

export default client;
