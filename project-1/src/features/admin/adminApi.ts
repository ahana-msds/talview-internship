import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Order {
    id: string;
    status: string;
    address: string;
    items: any[];
    workflow_id: string;
}

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4002/api/' }),
    tagTypes: ['Orders', 'Requests'],
    endpoints: (builder) => ({
        getOrders: builder.query<Order[], void>({
            // In a real app, this would be a Hasura subscription or query
            // For now, we'll fetch from our Node.js backend which can proxy Hasura
            query: () => 'orders',
            providesTags: ['Orders'],
        }),
        startOrder: builder.mutation<{ workflowId: string }, { orderId: string; address: string; items: any[] }>({
            query: (body) => ({
                url: 'orders/start',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Orders'],
        }),
        signalOrder: builder.mutation<{ success: boolean }, { id: string; signal: string; payload?: any }>({
            query: ({ id, signal, payload }) => ({
                url: `orders/${id}/signal/${signal}`,
                method: 'POST',
                body: { payload },
            }),
            invalidatesTags: ['Orders'],
        }),
        flagIssue: builder.mutation<void, { orderId: string; description: string; sentryId: string }>({
            query: (body) => ({
                url: 'requests/flag',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Requests'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useStartOrderMutation,
    useSignalOrderMutation,
    useFlagIssueMutation
} = adminApi;
