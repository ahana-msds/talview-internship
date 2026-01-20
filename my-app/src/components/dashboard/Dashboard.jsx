import React, { useState } from 'react';
import TodoList from './TodoList';
import ProductAPI from './ProductAPI';
import GithubAPI from './GithubAPI';

const Dashboard = ({ user, loginMethod, onLogout }) => {
    const [activeTab, setActiveTab] = useState('todo');

    return (
        <div className="dashboard">
            <div className="welcome-section">
                <h2>Welcome, {user.displayName || user.email}!</h2>
                <button onClick={onLogout} className="btn btn-outline">Logout</button>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'todo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('todo')}
                >
                    Todo List
                </button>
                <button
                    className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Product API
                </button>
                {loginMethod === 'github' && (
                    <button
                        className={`tab ${activeTab === 'github' ? 'active' : ''}`}
                        onClick={() => setActiveTab('github')}
                    >
                        GitHub API
                    </button>
                )}
            </div>

            <div className="tab-content">
                {activeTab === 'todo' && <TodoList />}
                {activeTab === 'products' && <ProductAPI />}
                {activeTab === 'github' && <GithubAPI />}
            </div>
        </div>
    );
};

export default Dashboard;