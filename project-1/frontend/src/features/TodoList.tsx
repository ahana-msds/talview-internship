import {
    useGetTodoListsQuery,
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useCreateListMutation,
    useDeleteTodoListMutation,
    type Todo,
    type TodoList as TodoListType
} from './todo/todoApi';
import { useState } from 'react';
import styles from './TodoList.module.css';
import { useAuth } from '../contexts/AuthContext';

export const TodoList = () => {
    const { user, loading: authLoading } = useAuth();
    // Ensure localStorage is in sync BEFORE any query fires
    const userEmail = user?.email || undefined;
    if (userEmail) {
        localStorage.setItem('user_email', userEmail);
    }
    // Pass userEmail as cache key — RTK Query auto-refetches when it changes
    const { data: lists, isLoading: isLoadingLists } = useGetTodoListsQuery(userEmail);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const { data: todos, isLoading: isLoadingTodos } = useGetTodosQuery(selectedListId || '', { skip: !selectedListId });
    const [createList] = useCreateListMutation();
    const [deleteTodoList] = useDeleteTodoListMutation();
    const [addTodo] = useAddTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');

    const [inputValue, setInputValue] = useState('');
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const activeList = lists?.find((l: TodoListType) => l.id === selectedListId);
    // General Tasks is accessible to everyone. Check name (case-insensitive) or fixed ID.
    const isGeneral = activeList?.name?.toLowerCase() === 'general tasks' || activeList?.id === 'list-1';
    const canEdit = isGeneral || activeList?.role === 'owner' || activeList?.role === 'editor';

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName) return;
        try {
            await createList({ name: newListName, emails: [email1, email2].filter(Boolean) }).unwrap();
            setNewListName('');
            setEmail1('');
            setEmail2('');
            setIsCreating(false);
        } catch (err) {
            console.error('Failed to create list:', err);
            alert('Failed to create list. Is the backend running?');
        }
    };

    const handleAddTodo = async () => {
        if (!inputValue.trim() || !selectedListId) return;
        try {
            await addTodo({ listId: selectedListId, text: inputValue }).unwrap();
            setInputValue('');
        } catch (err) {
            console.error('Failed to add todo:', err);
            alert('Failed to add task. Check if the backend is running.');
        }
    };

    const handleToggleComplete = async (todo: Todo) => {
        if (!canEdit) return;
        try {
            await updateTodo({ listId: selectedListId!, todoId: todo.id, completed: !todo.completed }).unwrap();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update task status.');
        }
    };

    const handleStartEdit = (todo: Todo) => {
        setEditingTodoId(todo.id);
        setEditingText(todo.text);
    };

    const handleSaveEdit = async () => {
        if (!editingTodoId || !selectedListId) return;
        try {
            await updateTodo({ listId: selectedListId, todoId: editingTodoId, text: editingText }).unwrap();
            setEditingTodoId(null);
        } catch (err) {
            console.error('Failed to save edit:', err);
            alert('Failed to save edits.');
        }
    };

    const handleDelete = async (todoId: string) => {
        if (!canEdit || !selectedListId) return;
        if (window.confirm('Delete this task?')) {
            try {
                await deleteTodo({ listId: selectedListId, todoId }).unwrap();
            } catch (err) {
                console.error('Failed to delete todo:', err);
                alert('Failed to delete task.');
            }
        }
    };

    const handleDeleteList = async () => {
        if (!selectedListId || selectedListId === 'list-1') return;
        if (window.confirm('Delete this list and all its tasks?')) {
            try {
                await deleteTodoList(selectedListId).unwrap();
                setSelectedListId(null);
            } catch (err) {
                console.error('Failed to delete list:', err);
                alert('Failed to delete list.');
            }
        }
    };

    if (isLoadingLists) return <div className="card">Loading lists...</div>;

    return (
        <div className={`card ${styles.featureCard}`}>
            <h3 className={styles.header}>Task Manager</h3>

            {!isCreating ? (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                    <div className={styles.listSelector} style={{ flex: 1, marginBottom: 0 }}>
                        <select
                            value={selectedListId || ''}
                            onChange={(e) => setSelectedListId(e.target.value)}
                            className="input"
                            style={{ width: '100%' }}
                        >
                            <option value="">Select a List</option>
                            {lists?.map((list: TodoListType) => (
                                <option key={list.id} value={list.id}>
                                    {list.name} {list.name === 'General Tasks' ? '(Public)' : `(${list.role})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedListId && selectedListId !== 'list-1' && activeList?.role === 'owner' && (
                        <button onClick={handleDeleteList} className="btn" style={{ background: 'var(--color-bg-alt)', color: 'red', border: '1px solid currentColor', fontSize: '1.2rem', padding: '5px 10px', height: '40px' }} title="Delete List">🗑️</button>
                    )}
                    <button onClick={() => setIsCreating(true)} className="btn btn-secondary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>CREATE NEW LIST</button>
                </div>
            ) : (
                <form onSubmit={handleCreateList} className={styles.createForm} style={{ background: 'var(--color-bg-alt)', padding: '15px', borderRadius: 'var(--radius)', marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Create New List</h4>
                    <input
                        className="input"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="List Name (e.g. Shopping)"
                        style={{ marginBottom: '10px', width: '100%' }}
                        required
                    />
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Share with up to 2 users (emails):</p>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input
                            className="input"
                            type="email"
                            value={email1}
                            onChange={(e) => setEmail1(e.target.value)}
                            placeholder="user@example.com"
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            title="Enter a valid email address"
                            style={{ flex: 1 }}
                        />
                        <input
                            className="input"
                            type="email"
                            value={email2}
                            onChange={(e) => setEmail2(e.target.value)}
                            placeholder="user@example.com"
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            title="Enter a valid email address"
                            style={{ flex: 1 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>CREATE</button>
                        <button type="button" onClick={() => setIsCreating(false)} className="btn btn-secondary" style={{ flex: 1 }}>CANCEL</button>
                    </div>
                </form>
            )}

            {selectedListId && (
                <>
                    <div className={styles.inputGroup} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input
                            className="input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Add a task..."
                            disabled={!canEdit}
                            style={{ flex: 1 }}
                        />
                        <button onClick={handleAddTodo} className="btn" disabled={!canEdit}>ADD</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {isLoadingTodos && <p>Loading tasks...</p>}
                        {todos?.map((todo: Todo) => (
                            <div key={todo.id} className={`${styles.item} ${todo.completed ? styles.completed : ''}`} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: 'var(--color-bg-alt)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--color-border)'
                            }}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={todo.completed}
                                    onChange={() => handleToggleComplete(todo)}
                                    disabled={!canEdit}
                                />

                                {editingTodoId === todo.id ? (
                                    <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
                                        <input
                                            className="input"
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            autoFocus
                                            style={{ flex: 1, padding: '4px 8px' }}
                                        />
                                        <button onClick={handleSaveEdit} className="btn btn-secondary" style={{ padding: '4px 12px' }}>Save</button>
                                        <button onClick={() => setEditingTodoId(null)} className="btn btn-secondary" style={{ padding: '4px 12px' }}>X</button>
                                    </div>
                                ) : (
                                    <span
                                        className={styles.text}
                                        onClick={() => canEdit && handleToggleComplete(todo)}
                                        style={{
                                            flex: 1,
                                            textDecoration: todo.completed ? 'line-through' : 'none',
                                            opacity: todo.completed ? 0.6 : 1,
                                            color: todo.completed ? 'var(--color-primary)' : 'var(--color-text)',
                                            cursor: canEdit ? 'pointer' : 'default',
                                            fontWeight: todo.completed ? 'normal' : '500'
                                        }}
                                    >
                                        {todo.text}
                                    </span>
                                )}
                                {!editingTodoId && canEdit && (
                                    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                        <button onClick={(e) => { e.stopPropagation(); handleStartEdit(todo); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✏️</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(todo.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};