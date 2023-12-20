import { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import ReCAPTCHA from 'react-google-recaptcha'
import Swal from 'sweetalert2';


import { InfoInclude, InfoTransport, CalculateQuote, Carrousel, Map } from '../components/';
import { useConfigStore } from '../hooks/useConfigStore';

const libraries = ['places'];

export const MapsClientPage = () => {

  const [isLoading, setIsLoading] = useState(false);

  const { costsValue, loading, startLoadingCosts } = useConfigStore();

  useEffect(() => {
    if (!isLoading) {
      const fetchData = async () => {
        setIsLoading(true);
        await startLoadingCosts();
      };

      fetchData();
    }
  }, [isLoading, startLoadingCosts]);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  const [mapKey, setMapKey] = useState(0); // Nuevo estado mapKey
  const [captchaValue, setCaptchaValue] = useState(null);

  const [weekdaysCount, setWeekdaysCount] = useState(0);
  const [weekendsCount, setWeekendsCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');

  const [stops, setStops] = useState([]);
  const [currentStop, setCurrentStop] = useState('');

  const sourceRef = useRef('');
  const destinationRef = useRef('');
  const departureDateRef = useRef('');
  const arrivalDateRef = useRef('');
  const autocompleteRef = useRef(null);
  const captcha = useRef(null)

  const cityOptions = ['Chilpancingo', 'Acapulco'];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: libraries
  });

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
      Swal.fire('Si desea cotizar mas de 1 parada porfavor comuniquese con un agente de ventas', '', 'warning');
    }
  };

  const removeStop = (index) => {
    const updatedStops = [...stops];
    updatedStops.splice(index, 1);
    setStops(updatedStops);
  };

  const calculateRoute = async (event) => {
    event.preventDefault();

    const SourceAndDestination = [sourceRef.current.value, destinationRef.current.value];
    const departureDate = new Date(departureDateRef.current.value);
    const arrivalDate = new Date(arrivalDateRef.current.value);

    if (SourceAndDestination.some(value => !value) || departureDate == 'Invalid Date' || arrivalDate == 'Invalid Date') {
      Swal.fire('Faltan campos por llenar', ' Por favor llena todos los campos obligatorios para calcular la ruta', 'error',);
      return;
    } else if (!captcha.current.getValue()) {
      Swal.fire('Por favor verifica el captcha', '', 'warning');
      return;
    }

    captcha.current.getValue() ? setCaptchaValue(true) : setCaptchaValue(false);

    const waypoints = stops.map((stop) => ({
      location: stop,
      stopover: true,
    }));

    const directionsRequest = {
      origin: SourceAndDestination.shift(),
      destination: SourceAndDestination.pop(),
      waypoints,
      travelMode: 'DRIVING'
    };

    const generatePath = (response, status) => {

      const differenceInMilliseconds = arrivalDate - departureDate;
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const durationInDays = Math.ceil(differenceInMilliseconds / millisecondsPerDay) + 1;

      if (status === 'OK') {
        setDirectionsResponse(response);

        const route = response.routes[0];
        let totalDistance = 0;
        let totalDuration = 0;

        for (let i = 0; i < route.legs.length; i++) {
          totalDistance += route.legs[i].distance.value;
          totalDuration += route.legs[i].duration.value;
        }

        // Conversión de minutos a horas y minutos
        const hours = Math.floor((totalDuration / 60) / 60);
        const minutes = totalDuration % 60;

        setDistance((totalDistance / 1000).toFixed(1)); // Convertir a kilómetros y redondear a dos decimales
        setTime(`${hours} h. ${minutes} min.`); // Formato de horas y minutos

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

    const element = document.getElementById('datos-salida');
    element.scrollIntoView({ behavior: 'smooth' });
  }

  // console.log(`dias total: ${duration}, entre semana ${weekdaysCount}, fin semana ${weekendsCount} `);

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance(0);
    setDuration(0);
    setStops([])
    sourceRef.current.value = '';
    destinationRef.current.value = '';
    departureDateRef.current.value = '';
    arrivalDateRef.current.value = '';
    captcha.current.reset();
    setMapKey((prevKey) => prevKey + 1); // Incrementar mapKey para forzar el desmontaje y remontaje del componente GoogleMap
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const onChange = () => {
    console.log('Cambio validacion Captcha');
  }

  if (!isLoaded && loading || costsValue == {} ) {
    return <div>Cargando aplicacion...</div>
  }


  return (
    <>
    {costsValue ? (
      <div className="container">

        <div className="row"> {/**CARROUSEL DE IMAGENES */}
          <div className="col-12 d-flex aling-items-center justify-content-center">
            <Carrousel
              costsValue={costsValue}
            />
          </div>
        </div>

        <form className="row mt-5 mb-4 justify-content-center align-items-center" onSubmit={calculateRoute}> {/**DATOS DE ENTRADA */}

          <div className="col-sm-6 col-12">
            <div className="row">
              <h2>Ingresa tu ruta</h2>
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

          <div className="col-sm-6 col-12 mt-3 mt-sm-0">
            <div className="row">
              <h2>Fechas del viaje</h2>
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

          <div className="col-12 mt-4">
            <div className="row">
              <h2>Parada </h2>
            </div>
          </div>

          <div className="col-6 col-sm-6 col-12">
            <div className="row">
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
                        }
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        type="submit"
                        className="btn btn-success"
                        onClick={() => {
                          addStop();       // Llama a la primera función
                          calculateRoute(); // Llama a la segunda función después de la primera
                        }}
                      ><i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </Autocomplete>
              </div>

              {/* Lista de paradas */}
              <div className="col-md-6  ">
                <ul className="border border-black rounded">
                  {stops.map((stop, index) => (
                    <li key={index} className=" d-flex justify-content-between align-items-center">
                      {stop}
                      <button className="btn btn-danger"
                        onClick={() => {
                          removeStop(index);       // Llama a la primera función
                          clearRoute(); // Llama a la segunda función después de la primera
                        }} >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-12">
            <div className="row justify-content-end">
              <div className="col-md-6 col-12 ">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }} // Utilizar estilo en línea para establecer el ancho al 100%
                  onClick={calculateRoute}
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
          <div className="col-12">
            <div className="row">
              <div className="col-12 mt-4 ">
                <ReCAPTCHA
                  ref={captcha}
                  sitekey={import.meta.env.VITE_CAPTCHA_API}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

        </form >

        <div className="row" id="datos-salida">

          <div className="col-md-4 mt-4" >  {/*DATOS DE SALIDA */}
            {captchaValue && directionsResponse ? (
              <CalculateQuote
                sourceRefValue={sourceRef.current.value}
                destinationRefValue={destinationRef.current.value}
                departureRefvalue={departureDateRef.current.value}
                arrivalRefValue={arrivalDateRef.current.value}
                distance={distance}
                time={time}
                duration={duration}
                weekdaysCount={weekdaysCount}
                weekendsCount={weekendsCount}
                stops={stops}
                costsValue={costsValue}
              />
            ) : <h3>Esperando cotizacion...</h3>
            }
          </div>

          <div className="col-md-8 mb-5"> {/**MAPA DE GOOGLE */}
            <div style={{ height: 'calc(95vh - 64px)' }}>
              <Map
                mapKey={mapKey}
                directionsResponse={directionsResponse} />
            </div>
          </div>

          <div className="row mt-3"> {/**INFORMACION EXTRA */}
            <div className="col-md-6 col-12">
              <InfoInclude />
            </div>
            <div className="col-md-6 col-12 mt-md-0 mt-3">
              <InfoTransport />
            </div>
          </div>
        </div>

      </div >

      ):(
        <div>conectando con BD... </div>
      )} 

    </>
  );
};