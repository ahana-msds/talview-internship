import React, { useEffect, useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
    Outlet,
    Link
} from 'react-router-dom';
import { User, ApiResponse } from '../../shared/types';
import { isUser, assertApiResponse } from './types/guards';
// --- REACT ROUTER v7 LOADERS ---
// This runs BEFORE the component renders
async function userLoader() {
    const res = await fetch('http://localhost:3001/api/users');
    const data = await res.json();
    return assertApiResponse<User[]>(data);
}
// --- COMPONENTS ---
// 1. Layout Component (Architecture)
const Layout = () => (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <nav>
            <Link to="/">Dashboard</Link> | <Link to="/users">Users</Link>
        </nav>
        <hr />
        <Outlet /> {/* Where child routes render */}
    </div>
);
// 2. Dashboard with Event System implementation
const Dashboard = () => {
    const [customMsg, setCustomMsg] = useState('');
    // Synthetic Event handle
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Synthetic Event (React):', e.type);
        // Dispatching a Custom Event (Native DOM)
        const event = new CustomEvent('app:alert', { detail: { msg: 'Hello from Dashboard!' } });
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
            <button onClick={handleButtonClick}>Trigger Events</button>
            {customMsg && <p>Custom Event Received: {customMsg}</p>}
        </div>
    );
};
// 3. UserList with React Router v7 Loader Data
const UserList = () => {
    const response = useLoaderData() as ApiResponse<User[]>;
    const users = response.data;
    return (
        <div>
            <h1>Users (v7 Loader)</h1>
            <ul>
                {users.map((user: User) => (
                    <li key={user.id}>
                        {user.name} - <strong>{user.role}</strong>
                        {isUser(user) ? " (Verified User)" : " (Unknown)"}
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
                element: <UserList />,
                loader: userLoader, // v7 Data Fetching
            },
        ],
    },
]);
export default function App() {
    return <RouterProvider router={router} />;
}