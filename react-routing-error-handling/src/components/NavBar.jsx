import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("auth");
        navigate("/");
    };

    return (
        <nav style={{ marginBottom: "20px" }}>
            <Link to="/">Login</Link> |{" "}
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/profile/1">Profile (Success)</Link> |{" "}
            <Link to="/profile/999">Profile (Error)</Link> |{" "}
            <Link to="/crash">Crash</Link> |{" "}
            <button onClick={logout}>Logout</button>
        </nav>
    );
};

export default Navbar;
