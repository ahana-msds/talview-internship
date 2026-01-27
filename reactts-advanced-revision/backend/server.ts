import express, { Request, Response } from 'express';
import cors from 'cors';
import { ApiResponse, ApiResponseStatus, User, UserWithPreferences } from '../shared/types';

// --- DECORATORS ---
// A simple method decorator that logs when a method is called
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`[LOG] Calling ${propertyKey} with args:`, JSON.stringify(args));
        return originalMethod.apply(this, args);
    };
}

// --- CONTROLLER CLASS ---
class UserController {
    @Log
    async getUsers(): Promise<User[]> {
        // Simulate fetching from a database
        return [
            { id: '1', name: 'Alice', role: 'ADMIN', email: 'alice@example.com' },
            { id: '2', name: 'Bob', role: 'USER', email: 'bob@example.com' }
        ];
    }

    @Log
    async getUserPreferences(id: string): Promise<UserWithPreferences> {
        return {
            id,
            name: 'Alice',
            role: 'ADMIN',
            email: 'alice@example.com',
            preferences: { theme: 'dark', notifications: true }
        };
    }
}

const app = express();
const port = 3001;
const userController = new UserController();

app.use(cors());
app.use(express.json());

// --- ROUTES WITH SERVER-SIDE TYPING ---
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await userController.getUsers();

        // Using the Generic ApiResponse interface
        const response: ApiResponse<User[]> = {
            status: ApiResponseStatus.SUCCESS,
            data: users,
            timestamp: Date.now()
        };

        res.json(response);
    } catch (error) {
        const errorResponse: ApiResponse<null> = {
            status: ApiResponseStatus.ERROR,
            data: null,
            message: 'Failed to fetch users',
            timestamp: Date.now()
        };
        res.status(500).json(errorResponse);
    }
});

app.get('/api/users/:id/preferences', async (req: Request, res: Response) => {
    const { id } = req.params;
    const prefs = await userController.getUserPreferences(id);

    const response: ApiResponse<UserWithPreferences> = {
        status: ApiResponseStatus.SUCCESS,
        data: prefs,
        timestamp: Date.now()
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
