import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    list_id: string;
}

export interface TodoList {
    id: string;
    name: string;
    owner_id: string;
    role?: string; // Derived from permissions
}

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4002/api/', // Proxy to Hasura or direct Hasura
        prepareHeaders: (headers) => {
            // In a real app, we'd get this from AuthContext
            headers.set('X-Hasura-Role', 'user');
            return headers;
        }
    }),
    tagTypes: ['TodoLists', 'Todos'],
    endpoints: (builder) => ({
        getTodoLists: builder.query<TodoList[], void>({
            query: () => 'todo-lists',
            providesTags: ['TodoLists'],
        }),
        getTodos: builder.query<Todo[], string>({
            query: (listId) => `todo-lists/${listId}/todos`,
            providesTags: (_result, _error, listId) => [{ type: 'Todos', id: listId }],
        }),
        addTodo: builder.mutation<Todo, { listId: string; text: string }>({
            query: (body) => ({
                url: `todo-lists/${body.listId}/todos`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { listId }) => [{ type: 'Todos', id: listId }],
        }),
        updateTodo: builder.mutation<Todo, { listId: string; todoId: string; text?: string; completed?: boolean }>({
            query: ({ listId, todoId, ...body }) => ({
                url: `todo-lists/${listId}/todos/${todoId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { listId }) => [{ type: 'Todos', id: listId }],
        }),
        deleteTodo: builder.mutation<void, { listId: string; todoId: string }>({
            query: ({ listId, todoId }) => ({
                url: `todo-lists/${listId}/todos/${todoId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { listId }) => [{ type: 'Todos', id: listId }],
        }),
        createList: builder.mutation<TodoList, { name: string; emails: string[] }>({
            query: (body) => ({
                url: 'todo-lists',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['TodoLists'],
        }),
        shareList: builder.mutation<void, { listId: string; userId: string; role: 'viewer' | 'editor' }>({
            query: (body) => ({
                url: `todo-lists/${body.listId}/share`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['TodoLists'],
        }),
    }),
});

export const {
    useGetTodoListsQuery,
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useCreateListMutation,
    useShareListMutation
} = todoApi;
