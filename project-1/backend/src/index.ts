import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import { getTemporalClient } from './temporal-client.js';

dotenv.config();

process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, exiting gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, exiting gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

const app = express();
const PORT = process.env.PORT || 4002;

// Initialize Sentry
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });
}

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Admin Control Endpoints (Simulating Lambda functions for Temporal triggers)
app.post('/api/orders/start', async (req, res) => {
    try {
        const client = await getTemporalClient();
        const { orderId, address, items } = req.body;

        // Lazy import workflow to avoid issues with worker bundles
        // @ts-ignore - TS sometimes struggles with .js extensions in source but it's required for NodeNext ESM
        const { orderWorkflow } = await import('./workflows/order.js');

        const handle = await client.workflow.start(orderWorkflow, {
            taskQueue: 'order-tasks',
            args: [orderId, address, items],
            workflowId: `order-${orderId}`,
        });

        res.json({ workflowId: handle.workflowId });
    } catch (err: any) {
        Sentry.captureException(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders/:id/signal/:signalName', async (req, res) => {
    try {
        const client = await getTemporalClient();
        const { id, signalName } = req.params;
        const { payload } = req.body;

        const handle = client.workflow.getHandle(id);
        await handle.signal(signalName, payload);

        res.json({ success: true });
    } catch (err: any) {
        Sentry.captureException(err);
        res.status(500).json({ error: err.message });
    }
});

// Mock Todo List Endpoints
let mockTodoLists = [
    { id: 'list-1', name: 'General Tasks', owner_id: 'guest', role: 'owner' }
];
let mockTodos: Record<string, any[]> = {
    'list-1': [
        { id: '1', text: 'Task 1', completed: false, list_id: 'list-1' },
        { id: '2', text: 'Task 2', completed: true, list_id: 'list-1' }
    ]
};

app.get('/api/todo-lists', (req, res) => {
    res.json(mockTodoLists);
});

app.post('/api/todo-lists', (req, res) => {
    const { name, emails } = req.body;
    const newList = {
        id: `list-${Date.now()}`,
        name,
        owner_id: 'guest',
        role: 'owner',
        shares: emails // Store for reference
    };
    mockTodoLists.push(newList);
    mockTodos[newList.id] = [];
    res.json(newList);
});

app.get('/api/todo-lists/:id/todos', (req, res) => {
    res.json(mockTodos[req.params.id] || []);
});

app.post('/api/todo-lists/:id/todos', (req, res) => {
    const { text } = req.body;
    const newTodo = { id: Date.now().toString(), text, completed: false, list_id: req.params.id };
    if (!mockTodos[req.params.id]) mockTodos[req.params.id] = [];
    mockTodos[req.params.id].push(newTodo);
    res.json(newTodo);
});

app.patch('/api/todo-lists/:listId/todos/:todoId', (req, res) => {
    const { listId, todoId } = req.params;
    const { text, completed } = req.body;
    const todos = mockTodos[listId];
    if (todos) {
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            if (text !== undefined) todo.text = text;
            if (completed !== undefined) todo.completed = completed;
            return res.json(todo);
        }
    }
    res.status(404).json({ error: 'Todo not found' });
});

app.delete('/api/todo-lists/:listId/todos/:todoId', (req, res) => {
    const { listId, todoId } = req.params;
    if (mockTodos[listId]) {
        mockTodos[listId] = mockTodos[listId].filter(t => t.id !== todoId);
        return res.json({ success: true });
    }
    res.status(404).json({ error: 'List not found' });
});

app.post('/api/todo-lists/:id/share', (req, res) => {
    // Mock sharing logic
    res.json({ success: true });
});

if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}

const server = app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Admin email: admin@talview.com | Password: Admin@123`);
    console.log(`Make sure to SIGN UP as admin@talview.com first if not already present in Firebase.`);
});

server.on('error', (err) => {
    console.error('Server failed to start/stay alive:', err);
});

// Heartbeat to keep the event loop alive if something is misbehaving
setInterval(() => {
    // console.log('Heartbeat...'); 
}, 60000);
