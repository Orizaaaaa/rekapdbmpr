import { createSlice } from '@reduxjs/toolkit';

const darkMode = createSlice({
    name: 'darkMode',
    initialState: {
        color: '',
    },
    reducers: {
        addColor: (state, action) => {
            state.color = action.payload;
        },
    }
});

export const { addColor } = darkMode.actions;
export default darkMode.reducer;
