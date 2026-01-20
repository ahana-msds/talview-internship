import { useDispatch, useSelector } from "react-redux";

export default function UserSearch() {
    const dispatch = useDispatch();
    const usersState = useSelector((state) => state.users);

    const data = usersState?.data || [];
    const loading = usersState?.loading;
    const error = usersState?.error;

    const onSearch = (e) => {
        dispatch({
            type: "users/search",
            payload: e.target.value,
        });
    };

    return (
        <div>
            <input
                placeholder="search users"
                onChange={onSearch}
            />

            {loading && <p>loading...</p>}
            {error && <p>{error}</p>}

            {data.map((user) => (
                <p key={user.id}>{user.name}</p>
            ))}
        </div>
    );
}
