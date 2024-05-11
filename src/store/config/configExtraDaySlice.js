import { createSlice } from '@reduxjs/toolkit';

export const configExtraDaySlice = createSlice({
    name: 'configExtraDay',
    initialState: {
        //estado
        editDay: true,
        costsExtraDay: [],
        totalEs: 0,
        totalFs: 0,
        activeCost: null,

    },
    reducers: {
        onLoadCostsExtraDay: (state, { payload }) => {
            state.costsExtraDay = payload;
            // state.loading = false; // Indicar que la carga ha finalizadoon Load Sum Total Extra Day Es
        },
        onLoadTotalSumExtraDayEs: (state, { payload }) => {
            state.totalEs = payload;
        },
        onLoadTotalSumExtraDayFs: (state, { payload }) => {
            state.totalFs = payload;
        },
    },
});


export const {
    onLoadTotalSumExtraDayEs,
    onLoadTotalSumExtraDayFs,
    onLoadCostsExtraDay,
} = configExtraDaySlice.actions;

// Exporta el initialState
export default configExtraDaySlice.reducer;