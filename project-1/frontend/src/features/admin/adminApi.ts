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

export interface RequestIssue {
    id: number;
    user_id: string;
    description: string;
    sentry_id: string;
    order_id: string;
    status: string;
    created_at: string;
    resolved_at: string | null;
}

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4002/api/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
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
        getRequests: builder.query<RequestIssue[], void>({
            query: () => 'requests',
            providesTags: ['Requests'],
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
    useGetRequestsQuery,
    useStartOrderMutation,
    useSignalOrderMutation,
    useFlagIssueMutation
} = adminApi;
