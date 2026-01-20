import React, { useState } from 'react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const addTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
            setNewTodo('');
        }
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    };

    const saveEdit = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: editText } : todo
        ));
        setEditingId(null);
    };

    const toggleComplete = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <div className="feature-container">
            <h3>Todo List</h3>

            <form onSubmit={addTodo} className="todo-form">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="input-field"
                />
                <button type="submit" className="btn btn-primary">Add</button>
            </form>

            <div className="todo-list">
                {todos.length === 0 ? (
                    <p className="empty-state">No tasks yet. Add one to get started!</p>
                ) : (
                    todos.map(todo => (
                        <div key={todo.id} className="todo-item">
                            {editingId === todo.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="input-field edit-input"
                                    />
                                    <button onClick={() => saveEdit(todo.id)} className="btn btn-small">Save</button>
                                    <button onClick={() => setEditingId(null)} className="btn btn-small">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <div className="todo-content" onClick={() => toggleComplete(todo.id)}>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo.id)}
                                        />
                                        <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
                                    </div>
                                    <div className="todo-actions">
                                        <button onClick={() => startEdit(todo)} className="btn btn-small">Edit</button>
                                        <button onClick={() => deleteTodo(todo.id)} className="btn btn-small btn-danger">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoList;