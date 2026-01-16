import { useEffect, useState } from "react";
import { fetchUpdates } from "../api/updatesApi";

export const useFetchUpdates = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        fetchUpdates()
            .then((res) => mounted && setData(res))
            .catch(() => setError("failed to fetch updates"))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    return { data, loading, error };
};
