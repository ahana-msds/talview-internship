import { Request, Response } from 'express';
import { db } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

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
            role: r.id === LIST_1_ID ? 'owner' : (r.owner_id === email ? 'owner' : 'editor'),
            updated_at: r.updated_at
        }));
        res.json(lists);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createTodoList = async (req: AuthRequest, res: Response) => {
    try {
        const email = req.user?.email || 'guest';
        const { name, emails } = req.body;
        // Readable ID: LIST-{timestamp}
        const listId = `LIST-${Date.now()}`;

        await db.query(
            'INSERT INTO todo_lists (id, name, owner_id) VALUES ($1, $2, $3)',
            [listId, name, email]
        );

        // Add shared users as editors
        if (emails && emails.length > 0) {
            for (const sharedEmail of emails.filter(Boolean)) {
                await db.query(
                    'INSERT INTO todo_permissions (user_id, list_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                    [sharedEmail, listId, 'editor']
                );
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
        // Readable ID: TASK-{timestamp}-{random4chars}
        const todoId = `TASK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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

        await db.query(
            'INSERT INTO todo_permissions (user_id, list_id, role) VALUES ($1, $2, $3) ON CONFLICT (user_id, list_id) DO UPDATE SET role = $3',
            [userId, listId, role || 'editor']
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
