import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

/**
 * RoutingBasics Component
 * 
 * Chapter: Role of React Router, setting up routes and links.
 */

const Home = () => <div><h4>Home Page</h4><p>Welcome to the main section of our mini-app.</p></div>;
const About = () => <div><h4>About Page</h4><p>This demo shows how client-side routing works without page refreshes.</p></div>;
const Services = () => <div><h4>Services Page</h4><p>We provide various Routing services.</p></div>;

const RoutingLayout = () => {
    return (
        <div style={layoutStyle}>
            <nav style={navStyle}>
                <Link to="basics" style={linkStyle}>Basics Home</Link>
                <Link to="about" style={linkStyle}>About</Link>
                <Link to="services" style={linkStyle}>Services</Link>
            </nav>
            <div style={contentStyle}>
                {/* Outlet is where the child routes will render */}
                <Outlet />
            </div>
        </div>
    );
};

const RoutingBasics = () => {
    return (
        <div className="demo-section">
            <h3>React Router Setup and Links</h3>
            <p style={{ fontSize: '0.85em', color: '#666' }}>
                React Router allows us to create dynamic, single-page navigation.
                Note how the URL in your address bar doesn't change significantly,
                and the page never reloads!
            </p>

            {/* 
        IMPORTANT: In a real app, <BrowserRouter> would wrap your entire App.
        For this demo, we're using a nested router.
      */}
            <div style={routerContainerStyle}>
                <Routes>
                    <Route path="/" element={<RoutingLayout />}>
                        <Route index element={<Home />} />
                        <Route path="basics" element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="services" element={<Services />} />
                    </Route>
                </Routes>
            </div>
        </div>
    );
};

const layoutStyle = {
    marginTop: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
};

const navStyle = {
    display: 'flex',
    background: '#f1f5f9',
    padding: '10px',
    gap: '15px',
    borderBottom: '1px solid #ddd'
};

const contentStyle = {
    padding: '20px',
    background: '#fff',
    minHeight: '150px'
};

const linkStyle = {
    textDecoration: 'none',
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: '0.9em'
};

const routerContainerStyle = {
    marginTop: '10px'
};

export default RoutingBasics;
