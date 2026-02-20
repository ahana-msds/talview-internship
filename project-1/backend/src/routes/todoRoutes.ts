import { Router } from 'express';
import {
    getTodoLists,
    createTodoList,
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    deleteTodoList,
    shareTodoList,
    unshareTodoList
} from '../controllers/todoController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Routes
router.get('/', authenticateToken, getTodoLists);
router.post('/', authenticateToken, createTodoList);
router.get('/:id/todos', authenticateToken, getTodos);
router.post('/:id/todos', authenticateToken, addTodo);
router.patch('/:listId/todos/:todoId', authenticateToken, updateTodo);
router.delete('/:listId/todos/:todoId', authenticateToken, deleteTodo);
router.delete('/:id', authenticateToken, deleteTodoList);
router.post('/:id/share', authenticateToken, shareTodoList);
router.post('/:id/unshare', authenticateToken, unshareTodoList);

export default router;
