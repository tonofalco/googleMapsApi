import { useConfigStore } from "../hooks/useConfigStore";


export const CalculateQuote = ({
    sourceRefValue,
    destinationRefValue,
    departureRefvalue,
    arrivalRefValue,
    distance,
    time,
    duration,
    weekdaysCount,
    weekendCount,
    stops,
    totalDays,
    multKms
}) => {

    const { costsValue, costsValueWeekend } = useConfigStore();

    const { hotel_es, food_es, park_es, renueve_es, hotel_fs, food_fs, park_fs, renueve_fs, gasoline, salary, booths, maintenance, utility, supplement } = costsValue
    const { gasoline: gasolineEs, salary: salaryEs, booths: boothsEs, maintenance: maintenanceEs, utility: utilityEs, supplement: supplementEs } = costsValueWeekend


    const calcularCosto = (dias, costoPorDia) => {
        let costo = (dias * costoPorDia);
        return costo <= 0 ? 0 : costo;
    };


    //CALCULO DISTANCIA FINAL
    const distancia = Math.round(parseFloat(distance * 2))
    //CALCULO MULTKMS PRIMER DIA
    const multKmsValueEs = distancia <= 400 ? gasolineEs + salaryEs + boothsEs + maintenanceEs + utilityEs + supplementEs : gasolineEs + salaryEs + maintenanceEs + boothsEs + utilityEs;
    const multKmsValueFs = distancia <= 400 ? gasoline + salary + maintenance + booths + utility + supplement : gasoline + salary + maintenance + booths + utility;
    const multKmsValue = (multKms ? multKmsValueEs : multKmsValueFs)
    //CALCULOS POR DIAS EXTRAS
    const diaExtraEntreSemanaBase = hotel_es + food_es + park_es + renueve_es
    const diaExtraFinSemanaBase = hotel_fs + food_fs + park_fs + renueve_fs
    const diasEntreSemanaCosto = calcularCosto(weekdaysCount, diaExtraEntreSemanaBase);
    const diasFinSemanaCosto = calcularCosto(weekendCount, diaExtraFinSemanaBase);
    const totalDiasCosto = diasEntreSemanaCosto + diasFinSemanaCosto
    //CALCULOS COSTO Y PRECIO VAN Y SPRINTER
    let plazas = 14
    const costoTotal = (distancia * multKmsValue)
    const precioTotal = Math.round(parseFloat(costoTotal) + parseFloat(totalDiasCosto))
    const formattedPrecioTotal = parseFloat(precioTotal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    let plazasSpt = 18
    const multKmsSpt = multKmsValue + 3
    const costoTotalSpt = (distancia * multKmsSpt)
    const precioTotalSpt = Math.round(parseFloat(costoTotalSpt) + parseFloat(totalDiasCosto))
    const formattedPrecioTotalSpt = parseFloat(precioTotalSpt).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 });


    //* Localizacion de calendario
    const departureDateValue = departureRefvalue
        ? new Date(departureRefvalue).toLocaleDateString('es-ES')
        : '';
    const arrivalDateValue = arrivalRefValue
        ? new Date(arrivalRefValue).toLocaleDateString('es-ES')
        : '';

    const phoneNumber = '7472269399';
    const paradaValue = stops.length <= 0 ? 'No' : stops
    // console.log(stops.length);
    // console.log(stops[0]);

    const messageVan = `Hola Viajes Quality, Quiero reservar. ${duration}d. - del ${departureDateValue} al ${arrivalDateValue}.
    - Salida: ${sourceRefValue}
    - Parada: ${paradaValue}
    - Destino: ${destinationRefValue}
    Toyota Van ${plazas} plazas | con precio total de: $${formattedPrecioTotal} ;
    __VQC__`;

    const messageSprinter = `Hola Viajes Quality, Quiero reservar. 2d. - del ${departureDateValue} al ${arrivalDateValue}.
    Salida: ${sourceRefValue}
    Parada: ${paradaValue}
    Destino: ${destinationRefValue}
    con precio total de: $${formattedPrecioTotalSpt} | Sprinter Hiace ${plazasSpt} plazas;
    __VQC__`;

    const sendVanQuote = () => {
        const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(messageVan)}`;
        window.open(url, '_blank');
    };

    const sendSprinterQuote = () => {
        const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(messageSprinter)}`;
        window.open(url, '_blank');
    };

    // Define las PropTypes para el componente Information
    // CalculateQuote.propTypes = {
    //     sourceRefValue: PropTypes.string,
    //     destinationRefValue: PropTypes.string,
    //     departureRefvalue: PropTypes.string,
    //     arrivalRefValue: PropTypes.string,
    //     distance: PropTypes.string,
    //     time: PropTypes.string,
    //     duration: PropTypes.string,
    //     weekdaysCount: PropTypes.number,
    //     weekendCount: PropTypes.number,
    //     stops: propTypes.isRequiredButNullable,
    //     costsValue: propTypes.isRequiredButNullable,
    // };

    return (
        <>
            <div className="text-start" style={{ marginTop: "-25px" }}>
                <h3 className='mb-3'>DATOS DEL VIAJE</h3>
                <div><b>Origen:</b> {sourceRefValue}</div>
                {stops.length >= 1 ? <div><b>Parada:</b> {stops}</div> : null}
                <div><b>Destino:</b> {destinationRefValue}</div>
                <div><b>Distancia:</b> {distancia} kms</div>
                <div><b>Tiempo de recorido:</b> {time}</div>
                <div><b>Dias:</b> {totalDays}</div>
                <br /><hr />

                <h3 className='mb-3'>PRECIOS</h3>
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Transporte</th>
                            {/* <th scope="col">Unitario</th> */}
                            <th scope="col">Total</th>
                            <th scope="col">Reservar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{plazas}</th>
                            <td>Van</td>
                            <td>{formattedPrecioTotal.toLocaleString()}</td>
                            <td><button className="btn btn-success" onClick={sendVanQuote}><i className="fa-brands fa-whatsapp"></i></button></td>
                        </tr>
                        <tr>
                            <th scope="row">{plazasSpt}</th>
                            <td>Sprinter</td>
                            <td>{formattedPrecioTotalSpt.toLocaleString()}</td>
                            <td><button className="btn btn-success" onClick={sendSprinterQuote}><i className="fa-brands fa-whatsapp"></i></button></td>
                        </tr>
                    </tbody>
                </table>
                <br /><hr />

                <h3 className='mb-3'>CLAUSULAS DEL SERVICIO</h3>
                <ul>
                    <li><small>En caso de no presentarse en la salida, el anticipo queda a beneficio de la empresa.</small></li>
                    <li><small>El contratante será responsable de los desperfectos causados a la unidad en servicio.</small></li>
                    <li><small>Precio aproximado, para reservar porfavor comuniquese con la empresa.</small></li>
                    <li><small>Precio final no inlcuye estacionamientos</small></li>

                </ul>
                <hr />
            </div>
        </>
    )
}

