import { configureStore,  } from "@reduxjs/toolkit";
import { configSlice, configExtraDaySlice } from "./";

export const store = configureStore({
    reducer: {
        config: configSlice.reducer,
        configExtraDay: configExtraDaySlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})