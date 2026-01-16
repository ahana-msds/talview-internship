import { useEffect, useState } from "react";
import { api } from "./api";

interface User {
    id: number;
    name: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        api.get("/users").then(response => {
            setUsers(response.data);
        });
    }, []);

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
