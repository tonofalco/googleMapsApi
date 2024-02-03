import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
    name: 'navBar',
    initialState: {
        costos: null,
        costosFinSemana: null,
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
        onLoadCostsEsSuccess: (state, { payload }) => {
            state.costosFinSemana = payload;
            state.loading = false; // Indicar que la carga ha finalizado
        },
        onLoadCostsFailure: (state) => {
            state.loading = false; // Indicar que ha ocurrido un error al cargar los datos
        },
    },
});

export const { onLoadCostsStart, onLoadCostsSuccess, onLoadCostsEsSuccess, onLoadCostsFailure } = configSlice.actions;

export default configSlice.reducer;