import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const login = () => {
        localStorage.setItem("auth", "true");
        navigate("/dashboard");
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={login}>Login</button>
        </div>
    );
};

export default Login;
