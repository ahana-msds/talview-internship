import express, { Request, Response } from 'express';
import cors from 'cors';
import { ApiResponse, ApiResponseStatus, User, UserWithPreferences } from '../shared/types';

// --- DECORATORS & SERVER TYPING ---

// 1. Method Decorator: @Log
// Decorators are a way to add metadata or behavior to classes, methods, or properties.
// In this case, we're intercepting the method call to log its arguments.
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        // Log the method name and arguments before execution
        console.log(`[LOG] Calling method: "${propertyKey}" | Arguments:`, JSON.stringify(args));
        return originalMethod.apply(this, args);
    };
}

// --- CONTROLLER CLASS ---
class UserController {
    // Applying the custom @Log decorator
    @Log
    async getUsers(): Promise<User[]> {
        // Mock data simulate fetching from a database
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

// Enable CORS for frontend communication
app.use(cors());
// Parse incoming JSON payloads
app.use(express.json());

// --- ROUTES WITH SERVER-SIDE TYPING ---

// 2. Typed Route Handler
// We use the 'Request' and 'Response' types from Express for type safety.
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await userController.getUsers();

        // 3. Using the Generic ApiResponse interface
        // This ensures the response sent to the client matches the shared type definition.
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

// Start the Express server
app.listen(port, () => {
    console.log(`[SERVER] Backend running at http://localhost:${port}`);
});
