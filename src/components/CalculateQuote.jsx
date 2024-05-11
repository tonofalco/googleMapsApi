import { useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';

import { useConfigExtraDayStore, useConfigStore } from "../hooks/";

export const CalculateQuote = ({ sourceRefValue, destinationRefValue, departureRefvalue, arrivalRefValue, distance, time, weekdaysCount, weekendCount, stops, totalDays, multKms }) => {

    const { costsValue, costsValueWeekend } = useConfigStore();
    const { sumaCostoDiaExtraEs, sumaCostoDiaExtraFs, totalEs, totalFs, } = useConfigExtraDayStore()

    // Cargamos la informacion de los costos
    useEffect(() => { sumaCostoDiaExtraEs(), sumaCostoDiaExtraFs() }, []);

    const { gasoline, salary, booths, maintenance, utility, supplement } = costsValue
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
    const diasEntreSemanaCosto = calcularCosto(weekdaysCount, totalEs);
    const diasFinSemanaCosto = calcularCosto(weekendCount, totalFs);
    const diasExtraSprinter = calcularCosto(totalDays, 3000);

    const totalDiasCosto = diasEntreSemanaCosto + diasFinSemanaCosto

    //CALCULOS COSTO Y PRECIO VAN Y SPRINTER
    let plazas = 15
    const costoTotal = (distancia * multKmsValue)
    const precioTotal = Math.round(parseFloat(costoTotal) + parseFloat(totalDiasCosto))
    const formattedPrecioTotal = parseFloat(precioTotal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    let plazasSpt = 20
    const multKmsSpt = 16
    const costoTotalSpt = (distancia * multKmsSpt)
    const precioTotalSpt = Math.round(parseFloat(costoTotalSpt) + parseFloat(diasExtraSprinter))
    const formattedPrecioTotalSpt = parseFloat(precioTotalSpt).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // console.log(precioTotal);

    //* Localizacion de calendario
    const departureDateValue = departureRefvalue
        ? new Date(departureRefvalue).toLocaleDateString('es-ES')
        : '';
    const arrivalDateValue = arrivalRefValue
        ? new Date(arrivalRefValue).toLocaleDateString('es-ES')
        : '';

    const phoneNumber = '7472269399';
    const paradaValue = stops.length <= 0 ? 'No' : stops

    const messageVan = `Hola Viajes Quality, Quiero reservar. ${totalDays}d. - del ${departureDateValue} al ${arrivalDateValue}.
    - Salida: ${sourceRefValue}
    - Parada: ${paradaValue}
    - Destino: ${destinationRefValue}
    Toyota Van ${plazas} plazas | con precio total de: ${formattedPrecioTotal} ;
    __VQC__`;

    const messageSprinter = `Hola Viajes Quality, Quiero reservar. ${totalDays}d.. - del ${departureDateValue} al ${arrivalDateValue}.
    Salida: ${sourceRefValue}
    Parada: ${paradaValue}
    Destino: ${destinationRefValue}
    con precio total de: ${formattedPrecioTotalSpt} | Sprinter Hiace ${plazasSpt} plazas;
    __VQC__`;

    const sendVanQuote = () => {
        const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(messageVan)}`;
        window.open(url, '_blank');
    };

    const sendSprinterQuote = () => {
        const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(messageSprinter)}`;
        window.open(url, '_blank');
    };


    return (
        <>
            <div className="text-start" style={{ marginTop: "-25px" }}>

                <h4 className='text-muted mb-3'>PRECIOS ESTIMADOS:</h4>
                <table className="table text-center mb-4">
                    <thead>
                        <tr>
                            <th scope="col"><i className="fa-solid fa-bus"></i></th>
                            <th scope="col">Transporte</th>
                            {/* <th scope="col">Unitario</th> */}
                            <th scope="col">Precio</th>
                            <th scope="col">Reservar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-align-center">
                            <th scope="row">{plazas}</th>
                            <td>Van</td>
                            <td className="bg-success text-light"><b>{formattedPrecioTotal.toLocaleString()}</b></td>
                            <td className="py-1"><button className="btn btn-success" onClick={sendVanQuote}><i className="fa-brands fa-whatsapp"></i></button></td>
                        </tr>
                        <tr>
                            <th scope="row">{plazasSpt}</th>
                            <td>Sprinter</td>
                            <td className="bg-success text-light mb-5"><b>{formattedPrecioTotalSpt.toLocaleString()}</b></td>
                            <td className="py-1"><button className="btn btn-success" onClick={sendSprinterQuote}><i className="fa-brands fa-whatsapp"></i></button></td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                <div className="mb-3">
                    <h4 className='text-muted'>DATOS DEL VIAJE:</h4>
                    <span><b>Distancia total:</b> {distancia} kms</span><br />
                    <span><b>Duracion del viaje:</b> {totalDays}</span><br />
                    <span><b>Tiempo total de manejo:</b> {time}</span><br />
                </div>

                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>RUTA CALCULADA</Accordion.Header>
                        <Accordion.Body style={{ padding: 0 }}>
                            <br />
                            <div className="row mx-1 ">
                                <div className="col-12">
                                    <ol className='list-group list-group-numbered'>
                                        <li className='list-group-item'>{sourceRefValue}</li>
                                        {stops.length >= 1 ? <li className='list-group-item'>{stops}</li> : null}
                                        <li className='list-group-item'>{destinationRefValue}</li>
                                    </ol>
                                </div>
                            </div>
                            <br />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>CLAUSULAS DEL SERVICIO</Accordion.Header>
                        <Accordion.Body>
                            <div className="row mx-1 ">
                                <div className="col-12">
                                    <ol className="list-group list-group">
                                        <li className="list-group-item">En caso de no presentarse en la salida, el anticipo queda a beneficio de la empresa.</li>
                                        <li className="list-group-item">El contratante será responsable de los desperfectos causados a la unidad en servicio.</li>
                                        <li className="list-group-item">Precio aproximado, para reservar porfavor comuniquese con la empresa.</li>
                                        <li className="list-group-item">Precio final no inlcuye estacionamientos.</li>
                                    </ol>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <hr />
            </div>
        </>
    )
}

