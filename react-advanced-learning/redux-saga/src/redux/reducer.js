import { SET_USER } from "./actions";

const initialState = { user: null };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            // updates store with fetched user
            return { ...state, user: action.payload };
        default:
            return state;
    }
}
