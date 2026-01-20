import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";

export default function UserFetcher() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    return (
        <>
            <button onClick={() => dispatch(fetchUser())}>
                fetch user
            </button>
            {user && <p>{user.name}</p>}
        </>
    );
}
