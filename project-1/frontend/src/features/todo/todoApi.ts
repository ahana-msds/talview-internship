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
    updated_at?: string;
}

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4002/api/', // Proxy to Hasura or direct Hasura
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['TodoLists', 'Todos'],
    endpoints: (builder) => ({
        getTodoLists: builder.query<TodoList[], string | undefined>({
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
            invalidatesTags: (_result, _error, { listId }) => [{ type: 'Todos', id: listId }, 'TodoLists'],
        }),
        updateTodo: builder.mutation<Todo, { listId: string; todoId: string; text?: string; completed?: boolean }>({
            query: ({ listId, todoId, ...body }) => ({
                url: `todo-lists/${listId}/todos/${todoId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { listId }) => [{ type: 'Todos', id: listId }, 'TodoLists'],
        }),
        deleteTodo: builder.mutation<void, { listId: string; todoId: string }>({
            query: ({ listId, todoId }) => ({
                url: `todo-lists/${listId}/todos/${todoId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { listId }) => [{ type: 'Todos', id: listId }, 'TodoLists'],
        }),
        createList: builder.mutation<TodoList, { name: string; emails: string[] }>({
            query: (body) => ({
                url: 'todo-lists',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['TodoLists'],
        }),
        deleteTodoList: builder.mutation<void, string>({
            query: (id) => ({
                url: `todo-lists/${id}`,
                method: 'DELETE',
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
    useDeleteTodoListMutation,
    useShareListMutation
} = todoApi;
