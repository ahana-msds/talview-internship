import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styles from './TodoList.module.css';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export const TodoList = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const isGuest = user?.provider === 'guest';
    const canAddMore = !isGuest || todos.length < 2;

    const handleAdd = () => {
        if (!inputValue.trim()) return;
        if (!canAddMore) return;

        setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
        setInputValue('');
    };

    const handleDelete = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const toggleComplete = (id: number) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const startEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditValue(todo.text);
    };

    const saveEdit = () => {
        if (editingId !== null && editValue.trim()) {
            setTodos(todos.map(t => t.id === editingId ? { ...t, text: editValue } : t));
            setEditingId(null);
            setEditValue('');
        }
    };

    return (
        <div className={`card ${styles.featureCard}`}>
            <h3 className={styles.header}>
                Task Manager
            </h3>

            <div className={styles.inputGroup}>
                <input
                    className="input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a task..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    disabled={!canAddMore}
                />
                <button
                    onClick={handleAdd}
                    className={`btn ${styles.addBtn}`}
                    disabled={!canAddMore}
                >
                    Add
                </button>
            </div>

            {isGuest && todos.length >= 2 && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.85rem' }}>
                        Guest users are limited to 2 tasks.
                    </p>
                    <Link
                        to="/login"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem' }}
                    >
                        Login for unlimited tasks
                    </Link>
                </div>
            )}

            <ul className={styles.list}>
                {todos.length === 0 && <li className={styles.emptyState}>No tasks yet.</li>}

                {todos.map(todo => (
                    <li key={todo.id} className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
                        {editingId === todo.id ? (
                            <div className={styles.editGroup}>
                                <input
                                    className={`input ${styles.editInput}`}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={saveEdit} className={`btn ${styles.saveBtn}`}>Save</button>
                                <button onClick={() => setEditingId(null)} className={`btn btn-secondary ${styles.actionBtn}`}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={todo.completed}
                                        onChange={() => toggleComplete(todo.id)}
                                    />
                                    <span className={styles.text}>{todo.text}</span>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => startEdit(todo)} className={`btn btn-secondary ${styles.actionBtn}`}>Edit</button>
                                    <button onClick={() => handleDelete(todo.id)} className={`btn btn-secondary ${styles.deleteBtn}`}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};