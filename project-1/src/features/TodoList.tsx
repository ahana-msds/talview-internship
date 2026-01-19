import { useState } from 'react';
import styles from './TodoList.module.css';
interface Todo {
    id: number;
    text: string;
}
export const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const handleAdd = () => {
        if (!inputValue.trim()) return;
        setTodos([...todos, { id: Date.now(), text: inputValue }]);
        setInputValue('');
    };
    const handleDelete = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
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
                Todo List
            </h3>

            <div className={styles.inputGroup}>
                <input
                    className="input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="New Task..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className={`btn ${styles.addBtn}`}>+</button>
            </div>
            <ul className={styles.list}>
                {todos.length === 0 && <li className={styles.emptyState}>No tasks yet.</li>}

                {todos.map(todo => (
                    <li key={todo.id} className={styles.item}>
                        {editingId === todo.id ? (
                            <div className={styles.editGroup}>
                                <input
                                    className={`input ${styles.editInput}`}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                />
                                <button onClick={saveEdit} className={`btn ${styles.saveBtn}`}>✓</button>
                            </div>
                        ) : (
                            <>
                                <span className={styles.text}>{todo.text}</span>
                                <div className={styles.actions}>
                                    <button onClick={() => startEdit(todo)} className={`btn btn-secondary ${styles.actionBtn}`}>Edit</button>
                                    <button onClick={() => handleDelete(todo.id)} className={`btn btn-secondary ${styles.deleteBtn}`}>Del</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};