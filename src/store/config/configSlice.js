import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
    name: 'navBar',
    initialState: {
        costos: {}
    },
    
    reducers: {
        onLoadCosts: (state, { payload }) => {
            state.costos = payload; // Actualizar la lista de usuarios en el estado
        },
    },
});


// Exporta el reducer
export const { onLoadCosts } = configSlice.actions;

// Exporta el initialState
export default configSlice.reducer;