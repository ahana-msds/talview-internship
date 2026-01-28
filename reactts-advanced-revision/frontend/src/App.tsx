import React, { useEffect, useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
    Outlet,
    Link,
    useNavigation
} from 'react-router-dom';
import { User, ApiResponse } from '../../shared/types';
import { isUser, assertApiResponse } from './types/guards';

// --- REACT ROUTER v7 DATA LOADER ---
// V7 Approach: Fetch data BEFORE the component mounts.
// This is defined outside the component and passed to the route definition.
async function userLoader() {
    const res = await fetch('http://localhost:3001/api/users');
    const data = await res.json();
    // Use the type assertion guard to ensure the data is valid
    return assertApiResponse<User[]>(data);
}

// --- COMPONENTS ---

// 1. Layout Component (Architecture)
// Traditional React Router Layout using <Outlet /> to render children.
const Layout = () => {
    const navigation = useNavigation(); // v7 state tracking
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
            <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <Link to="/">Dashboard</Link> | <Link to="/users">Users (v7 Loader)</Link> | <Link to="/users-v6">Users (v6 useEffect)</Link>
            </nav>

            {/* Show a global loading indicator during route transitions in v7 */}
            {navigation.state === "loading" && <div style={{ color: 'blue' }}>Loading page...</div>}

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <Outlet /> {/* Where child routes are rendered */}
            </div>
        </div>
    );
};

// 2. Dashboard with Event System implementation
const Dashboard = () => {
    const [customMsg, setCustomMsg] = useState('');

    // SYNTHETIC EVENT: React's wrapper around native browser events.
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('[EVENT] Synthetic Event (React):', e.type);

        // CUSTOM EVENT: Native DOM event used for decoupled communication.
        // Useful for notifying parts of the app that aren't in the same React tree.
        const event = new CustomEvent('app:alert', { detail: { msg: 'Hello from the Dashboard event system!' } });
        window.dispatchEvent(event);
    };

    useEffect(() => {
        const listener = (e: any) => setCustomMsg(e.detail.msg);
        window.addEventListener('app:alert', listener);
        return () => window.removeEventListener('app:alert', listener);
    }, []);

    return (
        <div>
            <h1>Event System Demo</h1>
            <p>Click the button to trigger a React Synthetic Event and a native Custom Event.</p>
            <button
                onClick={handleButtonClick}
                style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                Trigger Events
            </button>
            {customMsg && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
                    <strong>Custom Event Received:</strong> {customMsg}
                </div>
            )}
        </div>
    );
};

// 3. UserList - React Router v7 Approach (Data-Driven)
const UserListV7 = () => {
    // Data is already available because of the loader!
    // No 'isLoading' state needed inside the component.
    const response = useLoaderData() as ApiResponse<User[]>;
    const users = response.data;

    return (
        <div>
            <h1>Users (v7 Loader Pattern)</h1>
            <p style={{ color: '#666' }}>Data fetched BEFORE component mounting.</p>
            <ul>
                {users.map((user: User) => (
                    <li key={user.id} style={{ marginBottom: '10px' }}>
                        {user.name} ({user.email}) - <span style={{ fontWeight: 'bold', color: '#007bff' }}>{user.role}</span>
                        {isUser(user) && <span style={{ fontSize: '0.8em', marginLeft: '10px', color: 'green' }}>(Type Verified)</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// 4. UserList - React Router v6 Approach (Component-Driven)
// Demonstrating the "Old" way for comparison.
const UserListV6 = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // V6 style: Fetching inside useEffect AFTER mount.
    // Leads to "Loading..." flickering inside the component.
    useEffect(() => {
        fetch('http://localhost:3001/api/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading users (v6 style)...</div>;

    return (
        <div>
            <h1>Users (v6 useEffect Pattern)</h1>
            <p style={{ color: '#666' }}>Data fetched AFTER component mounting.</p>
            <ul>
                {users.map((user: User) => (
                    <li key={user.id}>
                        {user.name} - <strong>{user.role}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- ROUTER CONFIGURATION ---
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "users",
                element: <UserListV7 />,
                loader: userLoader, // v7 Loader: Data fetched before navigation completes
            },
            {
                path: "users-v6",
                element: <UserListV6 />, // v6 style: Component renders first, then fetches
            },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}