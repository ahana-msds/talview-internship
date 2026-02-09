import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
    loading: false,
    error: null,
    advancedStatus: 'idle',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Actions targeted by Sagas
        fetchUserRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Actions dispatched by Sagas (Effects)
        fetchUserSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        fetchUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Actions for advanced patterns
        setAdvancedStatus: (state, action) => {
            state.advancedStatus = action.payload;
        },
    },
});

export const {
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
    setAdvancedStatus,
} = userSlice.actions;

export default userSlice.reducer;
