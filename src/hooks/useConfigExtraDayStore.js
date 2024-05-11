import { useDispatch, useSelector } from "react-redux"
import { serverApi } from "../api"
import { onLoadCostsExtraDay, onLoadTotalSumExtraDayEs, onLoadTotalSumExtraDayFs } from "../store"


export const useConfigExtraDayStore = () => {

    const dispatch = useDispatch()

    const costs_extraDay = useSelector((state) => state.configExtraDay.costsExtraDay);
    const activeCost = useSelector((state) => state.configExtraDay.activeCost);
    const {totalEs, totalFs} = useSelector((state) => state.configExtraDay);


    // OBTENER SUMA TOTAL DE COSTO EN DIA ENTRE SEMANA
    const sumaCostoDiaExtraEs = () => {
        try {
            let suma = 0
            costs_extraDay.forEach(cost => {
                suma += cost.valueEs
            });

            // console.log(suma);
            dispatch(onLoadTotalSumExtraDayEs(suma));



        } catch (error) {
            console.log('Error cargando total Entre semana');
            console.log(error);
        }
    };

    // OBTENER SUMA TOTAL DE COSTO EN DIA FIN SEMANA
    const sumaCostoDiaExtraFs = () => {
        try {
            let suma = 0
            costs_extraDay.forEach(cost => {
                suma += cost.valueFs;
            });

            // console.log(suma);
            dispatch(onLoadTotalSumExtraDayFs(suma));
        } catch (error) {
            console.log('Error cargando total fin de semana');
            console.log(error);
        }
    };

    // OBTENER COSTOS DIA EXTRA
    const startLoadingCostsExtraDay = async () => {
        try {
            const { data } = await serverApi.get('/cost/extraDay');
            // console.log(data.costosDiaExtra);
            const costos = data.costosDiaExtra;
            dispatch(onLoadCostsExtraDay(costos)); // Pasar 'costos' como argumento
        } catch (error) {
            console.log('Error cargando costos');
            console.log(error);
        }
    };


    return {
        //* propiedades
        costs_extraDay,
        activeCost,
        totalEs,
        totalFs,

        //* Metodos
        sumaCostoDiaExtraEs,
        sumaCostoDiaExtraFs,
        startLoadingCostsExtraDay,
    }

}