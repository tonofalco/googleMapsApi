import { configureStore,  } from "@reduxjs/toolkit";
import { configSlice } from "./";

export const store = configureStore({
    reducer: {
        config: configSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})