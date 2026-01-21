
// action types
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const CANCEL_USER_FETCH = 'CANCEL_USER_FETCH';

// action creators
export const fetchUserRequest = (userId) => ({
    type: FETCH_USER_REQUEST,
    payload: userId,
});

export const fetchUserSuccess = (user) => ({
    type: FETCH_USER_SUCCESS,
    payload: user,
});

export const fetchUserFailure = (error) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
});

export const cancelUserFetch = () => ({
    type: CANCEL_USER_FETCH,
});
