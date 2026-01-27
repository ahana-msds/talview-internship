import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: {
            name: 'Ahana Das',
            settings: {
                theme: 'light',
                notifications: true
            }
        },
        activity: [],
        loading: false
    },
    reducers: {
        logActivity: (state, action) => {
            state.activity.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { logActivity, setLoading } = userSlice.actions;
export default userSlice.reducer;

// SELECT PATTERN: Complex selector to access nested state
export const selectUserTheme = (state) => state.user.profile.settings.theme;
export const selectUserActivityCount = (state) => state.user.activity.length;
