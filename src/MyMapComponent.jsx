import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 13.7563, // Bangkok
  lng: 100.5018,
};

function MyMapComponent() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC7CpvgT-oN0mbBRt9pUH833vqJaWupLU8',
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      <Marker position={center} />
    </GoogleMap>
  );
}

export default MyMapComponent;