import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        role: 'user' | 'admin';
    };
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4002/api/auth/' }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<AuthResponse['user'], { email: string; password: string }>({
            query: (user) => ({
                url: 'register',
                method: 'POST',
                body: user,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
