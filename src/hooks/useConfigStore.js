import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../api";
import { onLoadCostsStart, onLoadCostsSuccess, onLoadCostsFailure } from "../store";

export const useConfigStore = () => {
    const costsValue = useSelector((state) => state.config.costos);
    const loading = useSelector((state) => state.config.loading);

    const dispatch = useDispatch();

    const startLoadingCosts = async () => {
        try {
            dispatch(onLoadCostsStart()); // Indicar que se está iniciando la carga de datos
            const { data } = await serverApi.get('/config/costs');
            const config = data.configuracion[0];
            dispatch(onLoadCostsSuccess(config)); // Pasar los datos cargados al estado
        } catch (error) {
            console.log('Error cargando costos:', error);
            dispatch(onLoadCostsFailure()); // Indicar que ha habido un error al cargar los datos
        }
    };

    return {
        costsValue,
        loading,
        startLoadingCosts,
    };
};
