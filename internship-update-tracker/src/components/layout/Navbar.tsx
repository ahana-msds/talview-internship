import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h3 className="logo">internship tracker</h3>
            <div className="links">
                <Link to="/dashboard">dashboard</Link>
                <Link to="/login">login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
