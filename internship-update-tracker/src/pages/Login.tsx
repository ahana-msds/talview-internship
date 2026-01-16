import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/dashboard");
    };

    return (
        <div className="page">
            <h2>login</h2>
            <button onClick={handleLogin}>login</button>
        </div>
    );
};

export default Login;
