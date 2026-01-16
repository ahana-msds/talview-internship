import { useState } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("auth") === "true"
    );

    const login = () => {
        localStorage.setItem("auth", "true");
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("auth");
        setIsAuthenticated(false);
    };

    return { isAuthenticated, login, logout };
};
