import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: (limit = 10) => `posts?_limit=${limit}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Post', id })),
                        { type: 'Post', id: 'LIST' },
                    ]
                    : [{ type: 'Post', id: 'LIST' }],
        }),
        getPost: builder.query({
            query: (id) => `posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Post', id }],
        }),
        addPost: builder.mutation({
            query: (body) => ({
                url: 'posts',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),
        updatePost: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `posts/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: `posts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Post', id }, { type: 'Post', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useGetPostQuery,
    useAddPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi;
