import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4002/api';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchTodos();
        }
    }, [token]);

    const fetchTodos = async () => {
        try {
            const res = await axios.get(`${API_URL}/todos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(res.data);
        } catch (err) {
            setError('Failed to fetch todos');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setError('');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/todos`, { text: newTodo }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos([...todos, res.data]);
            setNewTodo('');
        } catch (err) {
            setError('Failed to add todo');
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    if (!token) {
        return (
            <div className="container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Todo List</h1>
            <button onClick={logout} style={{ marginBottom: '20px' }}>Logout</button>
            <form onSubmit={handleAddTodo}>
                <input
                    type="text"
                    placeholder="New todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit">Add Todo</button>
            </form>
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className="todo-item">{todo.text}</li>
                ))}
            </ul>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default App;
