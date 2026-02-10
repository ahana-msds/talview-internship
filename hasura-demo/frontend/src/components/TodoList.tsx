import React from 'react';
import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import { AddTodo } from './AddTodo';

// GraphQL Subscription for real-time updates
const TODOS_SUBSCRIPTION = gql`
  subscription GetTodos {
    todos(order_by: {created_at: desc}) {
      id
      title
      is_completed
      is_public
      user {
        username
      }
    }
  }
`;

export const TodoList: React.FC = () => {
    const { data, loading, error } = useSubscription<any>(TODOS_SUBSCRIPTION);

    if (loading) return <p>Loading real-time data...</p>;

    if (error) {
        return (
            <div style={{ color: 'red', border: '1px solid red', padding: '1rem' }}>
                <h3>Error Fetching Data</h3>
                <p>{error.message}</p>
                <p>This might be due to <b>Permissions</b>. The current role may not be allowed to select these fields.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Real-time Todo List</h2>
            <AddTodo />

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {data?.todos.map((todo: any) => (
                    <li key={todo.id} style={{
                        padding: '10px',
                        margin: '5px 0',
                        background: todo.is_completed ? '#e0ffd4' : '#f0f0f0',
                        borderLeft: todo.is_public ? '5px solid green' : '5px solid blue'
                    }}>
                        <strong style={{ textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
                            {todo.title}
                        </strong>
                        - <small>by {todo.user?.username || 'Unknown'}</small>
                        {todo.is_public ? <span> (Public)</span> : <span> (Private)</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
