import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup, Polyline } from "react-leaflet";
import { FaExchangeAlt } from "react-icons/fa";
import { LatLngExpression, LatLngTuple } from "leaflet";
import InputField from "./input-field";
import { parseCoords } from "./utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  const [start, setStart] = useState("45.748, 4.824");
  const [end, setEnd] = useState("45.781, 4.868");
  const [startCoords, setStartCoords] = useState<LatLngExpression | null>([45.748, 4.824]);
  const [endCoords, setEndCoords] = useState<LatLngExpression | null>([45.781, 4.868]);
  const mapRef = useRef<L.Map | null>(null);

  // Fonction pour gérer le changement de coordonnées (drag)
  const updateCoordinates = (latLng: L.LatLng, isStart: boolean) => {
    const updatedCoords: LatLngTuple = [latLng.lat, latLng.lng];
    if (isStart) {
      setStartCoords(updatedCoords);
      setStart(`${latLng.lat}, ${latLng.lng}`);
    } else {
      setEndCoords(updatedCoords);
      setEnd(`${latLng.lat}, ${latLng.lng}`);
    }
  };

  // Utiliser useEffect pour réagir aux changements de startCoords et endCoords
  useEffect(() => {
    if (mapRef.current && startCoords && endCoords) {
      const bounds: LatLngTuple[] = [startCoords as LatLngTuple, endCoords as LatLngTuple];
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [startCoords, endCoords]); // L'effet se déclenche chaque fois que startCoords ou endCoords change

  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
  };

  const findRoute = () => {
    const startCoord = parseCoords(start);
    const endCoord = parseCoords(end);

    if (startCoord && endCoord) {
      setStartCoords(startCoord);
      setEndCoords(endCoord);
    } else {
      alert("Invalid coordinates. Please enter in the format: latitude, longitude.");
    }
  };

  return (
    <div className="relative w-full z-1">
      <div className="absolute top-16 left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-[300px] z-[1000]">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Plan your route</h2>
        <div className="relative flex flex-col gap-1.5">
          <InputField label="Starting point (lat, long)" placeholder="e.g., 45.75, 4.85" value={start} setValue={setStart} />
          <button
            onClick={swapAddresses}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 my-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
          >
            <FaExchangeAlt className="text-gray-600 dark:text-gray-300" size={18} />
          </button>
          <InputField label="Destination (lat, long)" placeholder="e.g., 35.41, 139.41" value={end} setValue={setEnd} />
        </div>
        <button
          onClick={findRoute}
          className="w-full mt-3 bg-dark-green text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Find route
        </button>
      </div>

      <MapContainer
        center={startCoords ? startCoords : [45.75, 4.85]} // Vérification de startCoords
        zoom={13}
        className="w-full h-[calc(100vh-96px)]"
        attributionControl={true}
        ref={mapRef}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OSM">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {startCoords && (
          <Marker
            position={startCoords}
            draggable={true}
            eventHandlers={{
              dragend: (e) => updateCoordinates(e.target.getLatLng(), true), // Met à jour les coordonnées du point de départ
            }}
          >
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        {endCoords && (
          <Marker
            position={endCoords}
            draggable={true}
            eventHandlers={{
              dragend: (e) => updateCoordinates(e.target.getLatLng(), false), // Met à jour les coordonnées du point d'arrivée
            }}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}
        {startCoords && endCoords && (
          <Polyline positions={[startCoords, endCoords]} color="green" weight={4} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
