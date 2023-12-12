import {  useDispatch, useSelector } from "react-redux"
import { serverApi } from "../api"
import { onLoadCosts } from "../store"


export const useConfigStore = () => {

    const costsValue = useSelector((state) => state.config.costos)

    const dispatch = useDispatch()

    const startLoadingCosts = async () => {
        try {
            const { data } = await serverApi.get('/config/costs');
            const config = data.configuracion[0];
            // console.log(config);
            dispatch(onLoadCosts(config)); // Pasar 'usuarios' como argumento
        } catch (error) {
            console.log('Error cargando usuarios');
            console.log(error);
        }
    };


    return {
        costsValue,
        startLoadingCosts,
    }
}
