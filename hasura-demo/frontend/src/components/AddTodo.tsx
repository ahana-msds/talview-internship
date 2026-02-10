import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

// GraphQL Mutation to add a new todo
const ADD_TODO = gql`
  mutation AddTodo($title: String!, $is_public: Boolean!) {
    insert_todos_one(object: {title: $title, is_public: $is_public}) {
      id
      title
    }
  }
`;

export const AddTodo: React.FC = () => {
    const [title, setTitle] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    // useMutation hook returns a function to execute the mutation and the current state
    const [addTodo, { loading, error }] = useMutation(ADD_TODO);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTodo({ variables: { title, is_public: isPublic } })
            .then(() => {
                setTitle('');
                alert('Todo added successfully!');
            })
            .catch((err: any) => {
                console.error('Mutation error:', err);
            });
    };

    return (
        <div style={{ padding: '10px', background: '#f9f9f9', marginBottom: '20px' }}>
            <h3>Add New Todo</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="New Todo Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ padding: '8px', width: '200px' }}
                />
                <label style={{ marginLeft: '10px' }}>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    /> Public?
                </label>
                <button type="submit" disabled={loading} style={{ marginLeft: '10px', padding: '8px 16px' }}>
                    {loading ? 'Adding...' : 'Add Todo'}
                </button>
            </form>

            {error && (
                <p style={{ color: 'red' }}>
                    Error: {error.message} <br />
                    (Make sure the current user follows the Insert Permissions!)
                </p>
            )}
        </div>
    );
};
