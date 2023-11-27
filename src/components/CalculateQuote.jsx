import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';

export const CalculateQuote = ({
    sourceRefValue,
    destinationRefValue,
    departureRefvalue,
    arrivalRefValue,
    distance,
    time,
    duration,
    weekdaysCount,
    weekendsCount,
    stops
}) => {

    const calcularCosto = (dias, costoPorDia) => {
        let costo = (dias * costoPorDia);
        return costo <= 0 ? 0 : costo;
    };

    let diasEntreSemanaCosto = calcularCosto(parseInt(weekdaysCount), 2000);
    let diasFinSemanaCosto = calcularCosto(parseInt(weekendsCount), 2500);
    let totalDiasCosto = diasEntreSemanaCosto + diasFinSemanaCosto

    let plazasVan = 14
    let multKmsVan = 13
    let costoVan = (parseInt(distance) * 2) * multKmsVan
    let precioTotalVan = costoVan + totalDiasCosto
    // let precioUnitatioVan = (precioTotalVan / plazasVan).toFixed(1)

    let plazasSprinter = 18
    let multKmsSprinter = 16
    let costoSprinter = (parseInt(distance) * 2) * multKmsSprinter
    let precioTotalSprinter = costoSprinter + totalDiasCosto
    // let precioUnitatioSprinter = (precioTotalSprinter / plazasSprinter).toFixed(1)

    const departureDateValue = departureRefvalue
        ? new Date(departureRefvalue).toLocaleDateString('es-ES')
        : '';
    const arrivalDateValue = arrivalRefValue
        ? new Date(arrivalRefValue).toLocaleDateString('es-ES')
        : '';

    const phoneNumber = '7472269399';

    const paradaValue = stops.length <= 0 ?  'No' : stops
    console.log(stops.length);
    console.log(stops[0]);

    const messageVan = `Hola Viajes Quality, Quiero reservar. ${duration}d. - del ${departureDateValue} al ${arrivalDateValue}.
    - Salida: ${sourceRefValue}
    - Parada: ${paradaValue}
    - Destino: ${destinationRefValue}
    Toyota Van ${plazasVan} plazas | con precio total de: $${precioTotalVan} ;
    __VQC__`;

    const messageSprinter = `Hola Viajes Quality, Quiero reservar. 2d. - del ${departureDateValue} al ${arrivalDateValue}.
    Salida: ${sourceRefValue}
    Parada: ${paradaValue}
    Destino: ${destinationRefValue}
    con precio total de: $${precioTotalSprinter} | Sprinter Hiace 18 plazas;
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
    CalculateQuote.propTypes = {
        sourceRefValue: PropTypes.string,
        destinationRefValue: PropTypes.string,
        departureRefvalue: PropTypes.string,
        arrivalRefValue: PropTypes.string,
        distance: PropTypes.string,
        time: PropTypes.string,
        duration: PropTypes.string,
        weekdaysCount: PropTypes.number,
        weekendsCount: PropTypes.number,
        stops: propTypes.isRequiredButNullable,
    };

    return (
        <>
            <div className="text-start" style={{ marginTop: "-25px" }}>
                <h3 className='mb-3'>DATOS DEL VIAJE</h3>
                <div><b>Origen:</b> {sourceRefValue}</div>
                {stops.length >= 1 ? <div><b>Parada:</b> {stops}</div> : null}
                <div><b>Destino:</b> {destinationRefValue}</div>
                <div><b>Distancia:</b> {distance} kms</div>
                <div><b>Tiempo de recorido:</b> {time}</div>
                <div><b>Dias:</b> {duration}</div>
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
                            <th scope="row">{plazasVan}</th>
                            <td>Van</td>
                            <td>${precioTotalVan.toLocaleString()}</td>
                            <td><button className="btn btn-success" onClick={sendVanQuote}><i className="fa-brands fa-whatsapp"></i></button></td>
                        </tr>
                        <tr>
                            <th scope="row">{plazasSprinter}</th>
                            <td>Sprinter</td>
                            <td>${precioTotalSprinter.toLocaleString()}</td>
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


                {/* <div className='d-flex aling-items-center justify-content-center'>
                    <button className="btn btn-success me-5" onClick={sendVanQuote}>Reservar van <i className="fa-brands fa-whatsapp"></i></button>
                    <button className="btn btn-success" onClick={sendSprinterQuote}>Reservar sprinter <i className="fa-brands fa-whatsapp"></i></button>
                </div> */}
            </div>
        </>
    )
}

