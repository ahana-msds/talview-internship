import {
    useGetTodoListsQuery,
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useCreateListMutation,
    useDeleteTodoListMutation,
    useGetListUsersQuery,
    useShareListMutation,
    useUnshareListMutation,
    type Todo,
    type TodoList as TodoListType,
    type ListUser
} from './todo/todoApi';
import { useState } from 'react';
import styles from './TodoList.module.css';
import { useAuth } from '../contexts/AuthContext';

export const TodoList = () => {
    const { user } = useAuth();
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
    const [role1, setRole1] = useState<'viewer' | 'editor'>('editor');
    const [email2, setEmail2] = useState('');
    const [role2, setRole2] = useState<'viewer' | 'editor'>('editor');

    const [inputValue, setInputValue] = useState('');
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const [isManagingUsers, setIsManagingUsers] = useState(false);
    const [newAccessEmail, setNewAccessEmail] = useState('');
    const [newAccessRole, setNewAccessRole] = useState<'viewer' | 'editor'>('editor');

    const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
    const [editAccessEmail, setEditAccessEmail] = useState('');
    const [editAccessRole, setEditAccessRole] = useState<'viewer' | 'editor'>('editor');

    const { data: listUsers, isLoading: isLoadingUsers, error: errorUsers } = useGetListUsersQuery(selectedListId || '', { skip: !selectedListId || !isManagingUsers });
    const [shareList] = useShareListMutation();
    const [unshareList] = useUnshareListMutation();

    const activeList = lists?.find((l: TodoListType) => l.id === selectedListId);
    // General Tasks is accessible to everyone. Check name (case-insensitive) or fixed ID.
    const isGeneral = activeList?.name?.toLowerCase() === 'general tasks' || activeList?.id === 'list-1';
    const canEdit = isGeneral || activeList?.role === 'owner' || activeList?.role === 'editor';

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName) return;
        try {
            const users = [];
            if (email1) users.push({ email: email1, role: role1 });
            if (email2) users.push({ email: email2, role: role2 });
            await createList({ name: newListName, users }).unwrap();
            setNewListName('');
            setEmail1('');
            setRole1('editor');
            setEmail2('');
            setRole2('editor');
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

    const handleShare = async () => {
        if (!selectedListId || !newAccessEmail) return;
        try {
            await shareList({ listId: selectedListId, userId: newAccessEmail, role: newAccessRole }).unwrap();
            setNewAccessEmail('');
        } catch (err) {
            console.error('Failed to share:', err);
            alert('Failed to share list.');
        }
    };

    const handleStartEditUser = (u: ListUser) => {
        setEditingUserEmail(u.email);
        setEditAccessEmail(u.email);
        setEditAccessRole(u.role as 'viewer' | 'editor');
    };

    const handleSaveEditUser = async () => {
        if (!selectedListId || !editingUserEmail || !editAccessEmail) return;
        try {
            if (editingUserEmail !== editAccessEmail) {
                await unshareList({ listId: selectedListId, userId: editingUserEmail }).unwrap();
            }
            await shareList({ listId: selectedListId, userId: editAccessEmail, role: editAccessRole }).unwrap();
            setEditingUserEmail(null);
        } catch (err) {
            console.error('Failed to update user:', err);
            alert('Failed to update user.');
        }
    };

    const handleUnshare = async (userId: string) => {
        if (!selectedListId) return;
        if (window.confirm(`Revoke access for ${userId}?`)) {
            try {
                await unshareList({ listId: selectedListId, userId }).unwrap();
            } catch (err) {
                console.error('Failed to remove user:', err);
                alert('Failed to remove user.');
            }
        }
    };

    if (isLoadingLists) return <div className="card">Loading lists...</div>;

    return (
        <div className={`card ${styles.featureCard}`}>
            <h3 className={styles.header}>Task Manager</h3>

            {!isCreating ? (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className={styles.listSelector} style={{ flex: 1, marginBottom: 0, minWidth: '200px' }}>
                        <select
                            value={selectedListId || ''}
                            onChange={(e) => setSelectedListId(e.target.value)}
                            className="input"
                            style={{ width: '100%' }}
                        >
                            <option value="">Select a List...</option>
                            {lists?.map((list: TodoListType) => (
                                <option key={list.id} value={list.id}>
                                    {list.name} {list.name === 'General Tasks' ? '(Public)' : `(${user?.role === 'admin' ? 'admin' : list.role})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedListId && activeList?.updated_at && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap' }}>
                            Last changed: {new Date(activeList.updated_at).toLocaleString()}
                        </div>
                    )}
                    {selectedListId && selectedListId !== 'list-1' && (
                        <>
                            {user?.role === 'admin' && (
                                <button onClick={() => setIsManagingUsers(!isManagingUsers)} className="btn btn-secondary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                    {isManagingUsers ? 'DONE MANAGING' : '👥 MANAGE USERS'}
                                </button>
                            )}
                            {(activeList?.role === 'owner' || user?.role === 'admin') && (
                                <button onClick={handleDeleteList} className="btn" style={{ background: 'var(--color-bg-alt)', color: 'red', border: '1px solid currentColor', fontSize: '1.2rem', padding: '5px 10px', height: '40px' }} title="Delete List">🗑️</button>
                            )}
                        </>
                    )}
                    {!selectedListId && (
                        <button onClick={() => setIsCreating(true)} className="btn btn-secondary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>CREATE NEW LIST</button>
                    )}
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
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'nowrap' }}>
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>Email</label>
                            <input
                                className="input"
                                type="email"
                                value={email1}
                                onChange={(e) => setEmail1(e.target.value)}
                                placeholder="Co-worker 1"
                                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>Role</label>
                            <select className="input" value={role1} onChange={e => setRole1(e.target.value as 'viewer' | 'editor')} style={{ width: '100%', padding: '8px' }}>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'nowrap' }}>
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                            <input
                                className="input"
                                type="email"
                                value={email2}
                                onChange={(e) => setEmail2(e.target.value)}
                                placeholder="Co-worker 2"
                                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <select className="input" value={role2} onChange={e => setRole2(e.target.value as 'viewer' | 'editor')} style={{ width: '100%', padding: '8px' }}>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>CREATE</button>
                        <button type="button" onClick={() => setIsCreating(false)} className="btn btn-secondary" style={{ flex: 1 }}>CANCEL</button>
                    </div>
                </form>
            )}

            {selectedListId && (
                <>
                    {isManagingUsers && user?.role === 'admin' && (
                        <div style={{ background: 'var(--color-bg-alt)', padding: '15px', borderRadius: 'var(--radius)', marginBottom: '20px', border: '1px solid var(--color-border)' }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>List Access</h4>
                            {isLoadingUsers ? <p>Loading users...</p> : errorUsers ? <p style={{ color: 'red' }}>Error loading users: {JSON.stringify(errorUsers)}</p> : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                                    {listUsers?.map((u: ListUser) => (
                                        <li key={u.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                                            {editingUserEmail === u.email ? (
                                                <div style={{ display: 'flex', gap: '5px', flex: 1, marginRight: '10px' }}>
                                                    <input className="input" value={editAccessEmail} onChange={e => setEditAccessEmail(e.target.value)} style={{ padding: '4px 8px', flex: 1 }} />
                                                    <select className="input" value={editAccessRole} onChange={e => setEditAccessRole(e.target.value as 'viewer' | 'editor')} style={{ padding: '4px' }}>
                                                        <option value="editor">Editor</option>
                                                        <option value="viewer">Viewer</option>
                                                    </select>
                                                    <button onClick={handleSaveEditUser} className="btn" style={{ padding: '4px 8px' }}>Save</button>
                                                    <button onClick={() => setEditingUserEmail(null)} className="btn btn-secondary" style={{ padding: '4px 8px' }}>X</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span><strong>{u.email}</strong> <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>({u.role})</span></span>
                                                    {u.role !== 'owner' && (
                                                        <div>
                                                            <button onClick={() => handleStartEditUser(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginRight: '5px' }}>✏️</button>
                                                            <button onClick={() => handleUnshare(u.email)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.1rem' }}>❌</button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '10px', padding: '5px', borderTop: '1px solid var(--color-border)' }}>
                                <input
                                    className="input"
                                    placeholder="Add user email..."
                                    value={newAccessEmail}
                                    onChange={e => setNewAccessEmail(e.target.value)}
                                    style={{ flex: 3, padding: '6px' }}
                                />
                                <select className="input" value={newAccessRole} onChange={e => setNewAccessRole(e.target.value as 'viewer' | 'editor')} style={{ flex: 1, padding: '6px' }}>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <button
                                    onClick={handleShare}
                                    className="btn"
                                    disabled={!newAccessEmail}
                                    style={{ padding: '6px 12px', background: 'var(--color-primary)', fontSize: '0.8rem' }}
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    )}

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