import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

function UserLocationMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC7CpvgT-oN0mbBRt9pUH833vqJaWupLU8'
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  if (!isLoaded) return <div>Loading Maps...</div>;
  if (!location) return <div>Detecting your location...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={16}>
      <Marker position={location} />
    </GoogleMap>
  );
}

export default UserLocationMap;