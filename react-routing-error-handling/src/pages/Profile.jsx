import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../api/userAPI";

const Profile = () => {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError("");

        getUser(userId)
            .then((data) => setUser(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <p>Loading user...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h2>User Profile</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default Profile;
