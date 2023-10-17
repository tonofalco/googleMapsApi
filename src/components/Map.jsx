import PropTypes from 'prop-types';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';


export const Map = ({ mapKey, directionsResponse }) => {

  const center = { lat: 17.5470274, lng: -99.5032994 };


  Map.propTypes = {
    mapKey: PropTypes.number,
    directionsResponse: PropTypes.object,
  }

  return (
    <GoogleMap
      key={mapKey}
      center={center}
      zoom={13}
      mapContainerStyle={{
        width: "100%",
        height: "100%",
        borderRadius: "2rem",
      }}
      options={{
        streetViewControl: true,
        zoomControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker position={center} />
      {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
    </GoogleMap>
  )
}
