// Corrected version of your store configuration
import { configureStore } from '@reduxjs/toolkit';
import darkmodeReducer from './darkmodeSlice';

const store = configureStore({
    reducer: {
        darkMode: darkmodeReducer,
    },
});

export default store;
