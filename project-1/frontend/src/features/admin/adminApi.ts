import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Order {
    id: string;
    status: string;
    address: string;
    items: any[];
    workflow_id: string;
    userEmail?: string;
    createdAt?: string;
}

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4002/api/',
        prepareHeaders: (headers) => {
            const user = localStorage.getItem('auth-user');
            if (user) {
                try {
                    const parsed = JSON.parse(user);
                    if (parsed.email) {
                        headers.set('X-User-Email', parsed.email);
                    }
                } catch (e) {
                    // ignore invalid json
                }
            }
            return headers;
        },
    }),
    tagTypes: ['Orders', 'Requests'],
    endpoints: (builder) => ({
        getOrders: builder.query<Order[], void>({
            query: () => 'orders',
            providesTags: ['Orders'],
        }),
        getOrder: builder.query<Order, string>({
            query: (id) => `orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
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
    useGetOrderQuery,
    useStartOrderMutation,
    useSignalOrderMutation,
    useFlagIssueMutation
} = adminApi;
