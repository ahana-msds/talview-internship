import { Request, Response } from 'express';
import { db } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { getNextId } from '../utils/idGenerator.js';

const LIST_1_ID = 'list-1';

// Helper type for params
type TodoParams = {
    id: string;
    listId: string;
    todoId: string;
};

// Helper: determine user's role for a list
const getUserRole = async (listId: string, user: AuthRequest['user']): Promise<string> => {
    if (listId === LIST_1_ID) return 'owner'; // General Tasks is public
    if (!user) return 'none';
    if (user.role === 'admin') return 'owner'; // Admins have full access
    const email = user.email;

    // Check if user is owner
    const listResult = await db.query('SELECT owner_id FROM todo_lists WHERE id = $1', [listId]);
    if (listResult.rows.length === 0) return 'none';
    if (listResult.rows[0].owner_id === email) return 'owner';

    // Check permissions table
    const permResult = await db.query(
        'SELECT role FROM todo_permissions WHERE list_id = $1 AND user_id = $2', [listId, email]
    );
    if (permResult.rows.length > 0) return permResult.rows[0].role;

    return 'none';
};

export const getTodoLists = async (req: AuthRequest, res: Response) => {
    try {
        const email = req.user?.email;
        const isAdmin = req.user?.role === 'admin';

        let result;
        if (isAdmin) {
            result = await db.query(`SELECT id, name, owner_id, created_at, updated_at FROM todo_lists ORDER BY created_at ASC`);
        } else {
            result = await db.query(`
                SELECT DISTINCT l.id, l.name, l.owner_id, l.created_at, l.updated_at
                FROM todo_lists l
                LEFT JOIN todo_permissions p ON l.id = p.list_id
                WHERE l.id = $1
                OR l.owner_id = $2
                OR p.user_id = $2
                ORDER BY l.created_at ASC
            `, [LIST_1_ID, email || '']);
        }

        const lists = result.rows.map(r => ({
            id: r.id,
            name: r.name,
            owner_id: r.owner_id,
            role: (r.id === LIST_1_ID || isAdmin || r.owner_id === email) ? 'owner' : 'editor',
            updated_at: r.updated_at
        }));
        res.json(lists);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createTodoList = async (req: AuthRequest, res: Response) => {
    try {
        const { name, users } = req.body;
        const email = req.user?.email || 'unknown';

        // Advanced ID: list-{count}-{slug}
        const listId = await getNextId('todo_lists', 'list', name);

        // Create the list
        await db.query(
            'INSERT INTO todo_lists (id, name, owner_id) VALUES ($1, $2, $3)',
            [listId, name, email]
        );

        // Add shared users
        if (users && users.length > 0) {
            for (const u of users) {
                if (u.email && u.role) {
                    const userSuffix = u.email.split('@')[0];
                    const listSuffix = listId.split('-')[1];
                    const permId = await getNextId('todo_permissions', 'perm', `u-${userSuffix}-l-${listSuffix}`);

                    await db.query(
                        'INSERT INTO todo_permissions (id, user_id, list_id, role) VALUES ($1, $2, $3, $4)',
                        [permId, u.email, listId, u.role]
                    );
                }
            }
        }

        res.json({
            id: listId,
            name,
            owner_id: email,
            role: 'owner',
            updated_at: new Date().toISOString()
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as unknown as TodoParams;
        const role = await getUserRole(id, req.user);
        if (role === 'none') return res.status(403).json({ error: 'Access denied' });

        const result = await db.query(
            'SELECT * FROM todos WHERE list_id = $1 ORDER BY created_at ASC', [id]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const addTodo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as unknown as TodoParams;
        const role = await getUserRole(id, req.user);
        if (role !== 'owner' && role !== 'editor') {
            return res.status(403).json({ error: 'Only owners and editors can add tasks' });
        }

        const { text } = req.body;
        // Advanced ID: task-{count}-list-{suffix}
        // Extract list number from listId (e.g. list-1-shopping -> 1)
        const listSuffix = id.split('-')[1] || 'unknown';
        const todoId = await getNextId('todos', 'task', `list-${listSuffix}`);

        await db.query(
            'INSERT INTO todos (id, text, completed, list_id) VALUES ($1, $2, false, $3)',
            [todoId, text, id]
        );

        // Update list timestamp
        await db.query('UPDATE todo_lists SET updated_at = NOW() WHERE id = $1', [id]);

        res.json({ id: todoId, text, completed: false, list_id: id });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
    try {
        const { listId, todoId } = req.params as unknown as TodoParams;
        const role = await getUserRole(listId, req.user);

        if (role !== 'owner' && role !== 'editor') {
            return res.status(403).json({ error: 'Only owners and editors can modify tasks' });
        }

        const { text, completed } = req.body;
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (text !== undefined) {
            updates.push(`text = $${paramIndex++}`);
            values.push(text);
        }
        if (completed !== undefined) {
            updates.push(`completed = $${paramIndex++}`);
            values.push(completed);
        }

        if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });

        const currentParam = paramIndex;
        values.push(todoId, listId);
        const result = await db.query(
            `UPDATE todos SET ${updates.join(', ')} WHERE id = $${currentParam} AND list_id = $${currentParam + 1} RETURNING *`,
            values
        );

        // Update list timestamp
        await db.query('UPDATE todo_lists SET updated_at = NOW() WHERE id = $1', [listId]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
    try {
        const { listId, todoId } = req.params as unknown as TodoParams;
        const role = await getUserRole(listId, req.user);

        if (role !== 'owner' && role !== 'editor') {
            return res.status(403).json({ error: 'Only owners and editors can delete tasks' });
        }

        const result = await db.query('DELETE FROM todos WHERE id = $1 AND list_id = $2', [todoId, listId]);

        // Update list timestamp
        await db.query('UPDATE todo_lists SET updated_at = NOW() WHERE id = $1', [listId]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteTodoList = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as unknown as TodoParams;
        if (id === LIST_1_ID) return res.status(403).json({ error: 'Cannot delete public list' });

        const isAdmin = req.user?.role === 'admin';
        const listResult = await db.query('SELECT owner_id FROM todo_lists WHERE id = $1', [id]);

        if (listResult.rows.length === 0) return res.status(404).json({ error: 'List not found' });
        if (!isAdmin && listResult.rows[0].owner_id !== req.user?.email) {
            return res.status(403).json({ error: 'Only owners or admins can delete lists' });
        }

        await db.query('DELETE FROM todo_lists WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const shareTodoList = async (req: AuthRequest, res: Response) => {
    try {
        const { userId, role } = req.body;
        const { id } = req.params as unknown as TodoParams;
        const listId = id;

        // Verify Access (Admin or Owner)
        const userRole = await getUserRole(listId, req.user);
        if (userRole !== 'owner') {
            return res.status(403).json({ error: 'Only owners or admins can manage sharing' });
        }

        const userSuffix = userId.split('@')[0];
        const listSuffix = id.split('-')[1];
        const permId = await getNextId('todo_permissions', 'perm', `u-${userSuffix}-l-${listSuffix}`);

        await db.query(
            'INSERT INTO todo_permissions (id, user_id, list_id, role) VALUES ($1, $2, $3, $4)',
            [permId, userId, id, role || 'editor']
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const unshareTodoList = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.body; // Email to unshare
        const { id } = req.params as unknown as TodoParams;
        const listId = id;

        // Verify Access (Admin or Owner)
        const userRole = await getUserRole(listId, req.user);
        if (userRole !== 'owner') {
            return res.status(403).json({ error: 'Only owners or admins can manage sharing' });
        }

        await db.query(
            'DELETE FROM todo_permissions WHERE list_id = $1 AND user_id = $2',
            [listId, userId]
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getTodoListUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as unknown as TodoParams;
        const listId = id;

        // Verify Access
        const userRole = await getUserRole(listId, req.user);
        if (userRole === 'none') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get owner
        const listResult = await db.query('SELECT owner_id FROM todo_lists WHERE id = $1', [listId]);
        if (listResult.rows.length === 0) return res.status(404).json({ error: 'List not found' });

        const ownerEmail = listResult.rows[0].owner_id;

        // Get shared users
        const permResult = await db.query('SELECT user_id, role FROM todo_permissions WHERE list_id = $1', [listId]);

        const users = [
            { email: ownerEmail, role: 'owner' },
            ...permResult.rows.map(r => ({ email: r.user_id, role: r.role }))
        ];

        // Deduplicate in case owner is also in permissions somehow
        const uniqueUsers = Array.from(new Map(users.map(u => [u.email, u])).values());

        res.json(uniqueUsers);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
