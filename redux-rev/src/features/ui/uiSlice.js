import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: true,
    sidebarOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebar: (state, action) => {
            state.sidebarOpen = action.payload;
        },
    },
});

export const { toggleDarkMode, toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
