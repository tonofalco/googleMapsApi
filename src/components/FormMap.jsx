import { useState } from "react";
import { Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha'


export const FormMap = ({ sourceRef, destinationRef, arrivalDateRef, departureDateRef, autocompleteRef, captcha, stops, setStops, setDirectionsResponse, setDistance, setMapKey, calculateRoute }) => {

    const [selectedOption, setSelectedOption] = useState('');
    const [currentStop, setCurrentStop] = useState('');

    const cityOptions = ['Chilpancingo de los Bravos'];
    const handleOptionChange = (event) => setSelectedOption(event.target.value);
    const onChangeCaptcha = () => console.log('Cambió validacion');

    const handleDepartureDateChange = (event) => {
        const selectedDepartureDate = new Date(event.target.value);
        const minArrivalDate = new Date(selectedDepartureDate);
        minArrivalDate.setDate(minArrivalDate.getDate());
        arrivalDateRef.current.min = minArrivalDate.toISOString().split('T')[0];
    };

    const addStop = () => {
        if (stops.length < 1) {
            if (autocompleteRef.current) {
                const place = autocompleteRef.current.getPlace();
                if (place && place.formatted_address) {
                    setStops([...stops, place.formatted_address]);
                    setCurrentStop(''); // Restablecer el campo de entrada
                } else {
                    Swal.fire('Ingrese una parada válida', '', 'warning');
                }
            }
        } else {
            Swal.fire('Limite a solo una parada', 'Si desea obtener una cotización más personalizada, le invitamos a ponerse en contacto con uno de nuestros agentes de ventas.', 'warning');
        }
    };

    const removeStop = (index) => {
        const updatedStops = [...stops];
        updatedStops.splice(index, 1);
        setStops(updatedStops);
    };

    const clearRoute = () => {
        setDirectionsResponse(null);
        setDistance(0);
        setStops([])
        sourceRef.current.value = '';
        destinationRef.current.value = '';
        departureDateRef.current.value = '';
        arrivalDateRef.current.value = '';
        captcha.current.reset();
        setMapKey((prevKey) => prevKey + 1); // Incrementar mapKey para forzar el desmontaje y remontaje del componente GoogleMap
    }

    const clearMap = () => {
        setDirectionsResponse(null);
        setMapKey((prevKey) => prevKey + 1);
    }

    return (
        <>
            <form className="row mt-5 mb-4 justify-content-center align-items-center" onSubmit={calculateRoute}>

                {/* PUNTOS A CALCULAR */}
                <div className="col-sm-6 col-12">
                    <div className="row">
                        <h2>Ingresa tu ruta</h2>
                        {/* Punto de salida */}
                        <div className="col-md-6 my-1 my-md-0">
                            <span>Origen:</span>
                            <select
                                className="form-select"
                                aria-label="Seleccione una ciudad"
                                value={selectedOption}
                                onChange={handleOptionChange}
                                ref={sourceRef}
                            >
                                <option value="" disabled>Seleccione una ciudad</option>
                                {cityOptions.map((city) => (
                                    <option value={city} key={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        {/* Punto de destino */}
                        <div className="col-md-6 my-1 my-md-0">
                            <span>Destino:</span>
                            <Autocomplete>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ciudad de Destino"
                                    ref={destinationRef}
                                />
                            </Autocomplete>
                        </div>
                    </div>
                </div>
                {/* FECHAS */}
                <div className="col-sm-6 col-12 mt-3 mt-sm-0">
                    <div className="row">
                        <h2>Fechas del viaje</h2>
                        {/* Fecha de salida */}
                        <div className="col-md-6 my-1 my-md-0">
                            <span className="">Salida:</span>
                            <input
                                type="date"
                                className="form-control"
                                id="departureDate"
                                placeholder="Fecha de Salida"
                                onChange={handleDepartureDateChange}
                                ref={departureDateRef}
                            />
                        </div>
                        {/* Fecha de regreso */}
                        <div className="col-md-6 my-1 my-md-0">
                            <span className="">Regreso:</span>
                            <input
                                type="date"
                                className="form-control"
                                id="arrivalDate"
                                placeholder="Fecha de Llegada"
                                ref={arrivalDateRef}
                            />
                        </div>
                    </div>
                </div>
                {/* PARADAS */}
                <div className="col-12 mt-4">
                    <div className="row">
                        <h2>Parada </h2>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-12">
                    <div className="row">
                        {/* AÑADIR PARADA */}
                        <div className="col-md-6 ">
                            <Autocomplete
                                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                onPlaceSelected={(place) => {
                                    if (place.formatted_address) {
                                        setCurrentStop(place.formatted_address);
                                    }
                                }}
                            >
                                <div className="input-group"> {/* Contenedor para input y botón */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Agregar Parada (opcional)"
                                        value={currentStop}
                                        onChange={(e) => setCurrentStop(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addStop();
                                                clearMap()
                                            }
                                        }}
                                    />
                                    <div className="input-group-append">
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => {
                                                addStop();       // Llama a la primera función
                                                clearMap()
                                            }}
                                        ><i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </Autocomplete>
                        </div>
                        {/* LISTA DE PARADAS */}
                        <div className="col-md-6  ">
                            <ul className="border border-black rounded">
                                {stops.map((stop, index) => (
                                    <li key={index} className=" d-flex justify-content-between align-items-center">
                                        {stop}
                                        <button className="btn btn-danger"
                                            onClick={async () => {
                                                // e.preventDefault();
                                                removeStop(index);       // Llama a la primera función
                                                clearMap();
                                            }} >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* BOTONES */}
                <div className="col-sm-6 col-12">
                    <div className="row justify-content-end">
                        <div className="col-md-6 col-12 ">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }} // Utilizar estilo en línea para establecer el ancho al 100%
                            >
                                Cotizar
                            </button>
                        </div>
                        <div className="col-md-6 col-12 mt-md-0 mt-2  ">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ width: '100%' }} // Utilizar estilo en línea para establecer el ancho al 100%
                                onClick={clearRoute}
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                {/* CAPTCHA */}
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 mt-4 ">
                            <ReCAPTCHA
                                ref={captcha}
                                sitekey={import.meta.env.VITE_CAPTCHA_API}
                                onChange={onChangeCaptcha}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
