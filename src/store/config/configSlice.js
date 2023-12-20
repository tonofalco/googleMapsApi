import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
    name: 'navBar',
    initialState: {
        costos: null, // Inicializa como null para indicar que los datos están pendientes
        loading: false, // Nuevo estado para indicar si los datos se están cargando
    },
    
    reducers: {
        onLoadCostsStart: (state) => {
            state.loading = true; // Indicar que se está cargando la información
        },
        onLoadCostsSuccess: (state, { payload }) => {
            state.costos = payload;
            state.loading = false; // Indicar que la carga ha finalizado
        },
        onLoadCostsFailure: (state) => {
            state.loading = false; // Indicar que ha ocurrido un error al cargar los datos
        },
    },
});

export const { onLoadCostsStart, onLoadCostsSuccess, onLoadCostsFailure } = configSlice.actions;

export default configSlice.reducer;