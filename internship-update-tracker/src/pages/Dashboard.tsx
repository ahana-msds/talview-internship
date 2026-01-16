import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchUpdates } from "../hooks/useFetchUpdates";
import ControlledUpdateForm from "../components/forms/ControlledUpdateForm";

const Dashboard: React.FC = () => {
    const { data, loading, error } = useFetchUpdates();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return data.filter((d) =>
            d.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    if (loading) return <p>loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="page">
            <h2>dashboard</h2>

            <input
                placeholder="search updates"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ControlledUpdateForm />

            <ul>
                {filtered.map((u) => (
                    <li key={u.id}>
                        <Link to={`/update/${u.id}`}>{u.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
