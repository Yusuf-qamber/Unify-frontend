import { useState, useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker } from "react-map-gl";

const DEFAULT_COORDS = { lat: 26.0667, lng: 50.5577 }; 

const MapBox = ({ coordinates, onLocationChange, readOnly = false }) => {
  const [coords, setCoords] = useState(coordinates || DEFAULT_COORDS);

 
  useEffect(() => {
    if (coordinates) setCoords(coordinates);
  }, [coordinates]);

  const handleMarkerChange = (lat, lng) => {
    if (readOnly) return; 
    setCoords({ lat, lng });
    if (onLocationChange) onLocationChange({ lat, lng });
  };

  return (
    <Map
      initialViewState={{
        longitude: coords.lng,
        latitude: coords.lat,
        zoom: 12,
      }}
      style={{ width: "100%", height: 400 }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onClick={(e) => {
        if (!readOnly) {
          const { lng, lat } = e.lngLat;
          handleMarkerChange(lat, lng);
        }
      }}
    >
      <Marker
        latitude={coords.lat}
        longitude={coords.lng}
        color="red"
        draggable={!readOnly}
        onDragEnd={(e) => {
          if (!readOnly) {
            const { lng, lat } = e.lngLat;
            handleMarkerChange(lat, lng);
          }
        }}
      />
    </Map>
  );
};

export default MapBox;
