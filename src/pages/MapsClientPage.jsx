import { useState, useRef } from 'react';

import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';

import { InfoInclude, InfoTransport, CalculateQuote, Carrousel, Map } from '../components/';

const libraries = ['places'];

export const MapsClientPage = () => {

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mapKey, setMapKey] = useState(0); // Nuevo estado mapKey
  // const [datesCount, setDatesCount] = useState(0);
  const [weekdaysCount, setWeekdaysCount] = useState(0);
  const [weekendsCount, setWeekendsCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');

  const sourceRef = useRef('');
  const destinationRef = useRef('');
  const departureDateRef = useRef('');
  const arrivalDateRef = useRef('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: libraries
  });


  const handleDepartureDateChange = (event) => {
    const selectedDepartureDate = new Date(event.target.value);
    const minArrivalDate = new Date(selectedDepartureDate);
    minArrivalDate.setDate(minArrivalDate.getDate() + 1);
    arrivalDateRef.current.min = minArrivalDate.toISOString().split('T')[0];
  };


  const calculateRoute = async (event) => {
    event.preventDefault();

    const SourceAndDestination = [sourceRef.current.value, destinationRef.current.value];
    const departureDate = new Date(departureDateRef.current.value);
    const arrivalDate = new Date(arrivalDateRef.current.value);

    console.log(SourceAndDestination);

    // Sweetalert2
    if (SourceAndDestination.some(value => !value) || departureDate == 'Invalid Date' || arrivalDate == 'Invalid Date') {
      Swal.fire('Faltan campos por seleccionar', '', 'warning');
      return;
    }

    const directionsRequest = {
      origin: SourceAndDestination.shift(),
      destination: SourceAndDestination.pop(),
      travelMode: 'DRIVING'
    };

    const differenceInMilliseconds = arrivalDate - departureDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const durationInDays = Math.ceil(differenceInMilliseconds / millisecondsPerDay);



    const generatePath = (response, status) => {
      if (status === 'OK') {
        setDirectionsResponse(response);
        setDistance(response.routes[0].legs[0].distance.text);
        setDuration(durationInDays.toString()); // Convertir a cadena de texto antes de establecerlo

        // Determinar días de la semana y días de fin de semana
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dates = [];
        const weekdays = [];
        const weekends = [];

        for (let i = 3; i <= durationInDays + 1; i++) {
          const currentDate = new Date(departureDate);
          currentDate.setDate(departureDate.getDate() + i);
          dates.push(currentDate);

          if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            weekends.push(daysOfWeek[currentDate.getDay()]);
          } else {
            weekdays.push(daysOfWeek[currentDate.getDay()]);
          }
        }

        setWeekdaysCount(weekdays.length);
        setWeekendsCount(weekends.length);
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(directionsRequest, generatePath);
  }


  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance(0);
    setDuration(0);
    sourceRef.current.value = '';
    destinationRef.current.value = '';
    departureDateRef.current.value = '';
    arrivalDateRef.current.value = '';
    setMapKey((prevKey) => prevKey + 1); // Incrementar mapKey para forzar el desmontaje y remontaje del componente GoogleMap
  }

  if (!isLoaded) {
    return <div>Cargando...</div>
  }

  const cityOptions = ['Chilpancingo', 'Acapulco'];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>

      <div className="container">

        <div className="row"> {/**CARROUSEL DE IMAGENES */}
          <div className="col-12 d-flex aling-items-center justify-content-center">
            <Carrousel />
          </div>
        </div>

        <form className="row mt-5 mb-4 justify-content-center align-items-center" onSubmit={calculateRoute}> {/**DATOS DE ENTRADA */}
          
          <div className="col-md-2 my-1 my-md-0">
          <span className="d-md-none">Origen:</span>
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
          <div className="col-md-2 my-1 my-md-0">
          <span className="d-md-none">Destino:</span>
            <Autocomplete>
              <input
                type="text"
                className="form-control"
                placeholder="Ciudad de Destino"
                ref={destinationRef}
              />
            </Autocomplete>
          </div>
          <div className="col-md-2 my-1 my-md-0">
            <span className="d-md-none">Fecha de salida:</span>
            <input
              type="date"
              className="form-control"
              id="departureDate"
              placeholder="Fecha de Salida"
              onChange={handleDepartureDateChange}
              ref={departureDateRef}
            />
          </div>
          <div className="col-md-2 my-1 my-md-0">
          <span className="d-md-none">Fecha de regreso:</span>
            <input
              type="date"
              className="form-control"
              id="arrivalDate"
              placeholder="Fecha de Llegada"
              ref={arrivalDateRef}
            />
          </div>
          <div className="col-md-2 my-2 my-md-0">
            <div className="d-grid gap-1">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={calculateRoute}
              >
                Cotizar
              </button>
            </div>
          </div>
          <div className="col-md-2">
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearRoute}
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col-md-4 mt-4">  {/*DATOS DE SALIDA */}
            {directionsResponse ? (
              <CalculateQuote
                sourceRefValue={sourceRef.current.value}
                destinationRefValue={destinationRef.current.value}
                departureRefvalue={departureDateRef.current.value}
                arrivalRefValue={arrivalDateRef.current.value}
                distance={distance}
                directionsResponseValue={directionsResponse.routes[0].legs[0].duration.text}
                duration={duration}
                weekdaysCount={weekdaysCount}
                weekendsCount={weekendsCount}
              />
            ) : <h3>Esperando cotizacion...</h3>

            }
          </div>

          <div className="col-md-8"> {/**MAPA DE GOOGLE */}
            <div className="mb-4" style={{ height: 'calc(95vh - 64px)' }}>
              <Map
                mapKey={mapKey}
                directionsResponse={directionsResponse} />
            </div>
          </div>
        </div>

        <div className="row"> {/**INFORMACION EXTRA */}
          <div className="col-12 col-md-6">
            <InfoInclude />
          </div>
          <div className="col-12 col-md-6">
            <InfoTransport />
          </div>
        </div>

      </div>
    </>
  );
};