
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';


export const Map = ({ mapKey, directionsResponse }) => {

  const center = { lat: 17.5470274, lng: -99.5032994 };


  return (
    <>
      <h4 className='text-muted text-center'>MAPA</h4>
      <GoogleMap
        key={mapKey}
        center={center}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "98%", borderRadius: "2rem" }}
        options={{
          streetViewControl: false,
          zoomControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={center} />
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </>
  )
}
