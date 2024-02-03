import { useState, useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { eachDayOfInterval, getDay, addDays  } from 'date-fns';
import { InfoInclude, InfoTransport, CalculateQuote, Carrousel, Map, FormMap } from '../components/';
import { useConfigStore } from '../hooks/useConfigStore';

const libraries = ['places'];

export const MapsClientPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const [mapKey, setMapKey] = useState(0); // Nuevo estado mapKey
  const [captchaValue, setCaptchaValue] = useState(null);

  const [weekdaysCount, setWeekdaysCount] = useState(0);
  const [weekendCount, setWeekendCount] = useState(null);
  const [multKms, setMultKms] = useState(false)

  const [stops, setStops] = useState([]);

  const sourceRef = useRef('');
  const destinationRef = useRef('');
  const departureDateRef = useRef('');
  const arrivalDateRef = useRef('');
  const autocompleteRef = useRef(null);
  const captcha = useRef(null)

  const { costsValue, loading, startLoadingCosts, startLoadingEsCosts } = useConfigStore();

  useEffect(() => {
    if (!isLoading) {
      const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([
          startLoadingCosts(),
          startLoadingEsCosts()
        ]);
      };
      fetchData();
    }
  }, [isLoading]);


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: libraries
  });

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

        if (departureDate && arrivalDate) {
          const startDate = addDays(departureDate, 1); 
          const daysInterval = eachDayOfInterval({ start: departureDate, end: arrivalDate });
          const totalDaysValue = daysInterval.length;
          const weekdaysCountValue = daysInterval.slice(2).filter(date => getDay(date) >= 1 && getDay(date) <= 5).length;
          const weekendCountValue = totalDaysValue - weekdaysCountValue - 1; // Restamos el día inicial


          setTotalDays(totalDaysValue);
          setWeekdaysCount(weekdaysCountValue);
          setWeekendCount(weekendCountValue);
          // console.log(`  totaldias: ${totalDays}, entresemana: ${weekdaysCount}, fin semana: ${weekendCount}`);

          (startDate.getDay() >= 1 && startDate.getDay() <= 5 ? setMultKms(true) : setMultKms(false))
        }
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(directionsRequest, generatePath);

    const element = document.getElementById('datos-salida');
    element.scrollIntoView({ behavior: 'smooth' });
  }

  if (!isLoaded && loading || costsValue == {}) {
    return <div>Cargando aplicacion...</div>
  }


  return (
    <>
      {costsValue ? (
        <div className="container">
          {/**CARROUSEL DE IMAGENES */}
          <Carrousel costsValue={costsValue} />
          {/* DATOS DE ENTRADA */}
          < FormMap
            sourceRef={sourceRef}
            destinationRef={destinationRef}
            arrivalDateRef={arrivalDateRef}
            departureDateRef={departureDateRef}
            autocompleteRef={autocompleteRef}
            stops={stops}
            setStops={setStops}
            setDirectionsResponse={setDirectionsResponse}
            setDistance={setDistance}
            setDuration={setDuration}
            setMapKey={setMapKey}
            captcha={captcha}
            calculateRoute={calculateRoute}
          />
          {/* INFORMACION DE LA COTIZACION */}
          <div className="row" id="datos-salida">
            <div className="col-md-4 mt-4" >  {/*DATOS DE SALIDA */}
              {captchaValue && directionsResponse ? (
                <CalculateQuote
                  sourceRefValue={sourceRef.current.value}
                  destinationRefValue={destinationRef.current.value}
                  departureRefvalue={departureDateRef.current.value}
                  arrivalRefValue={arrivalDateRef.current.value}
                  stops={stops}
                  time={time}
                  distance={distance}
                  duration={duration}
                  totalDays={totalDays}
                  weekdaysCount={weekdaysCount}
                  weekendCount={weekendCount}
                  multKms={multKms}
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
      ) : (
        <div>conectando con BD... </div>
      )}
    </>
  );
};