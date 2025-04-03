"use client";

import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaExchangeAlt } from "react-icons/fa";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState<LatLngExpression | null>(null);
  const [endCoords, setEndCoords] = useState<LatLngExpression | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
  };

  const findRoute = () => {
    const parseCoords = (input: string) => {
      const regex = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
      const match = input.match(regex);
      if (match) {
        return [parseFloat(match[1]), parseFloat(match[2])] as L.LatLngTuple;
      }
      return null;
    };
  
    const startCoord = parseCoords(start);
    const endCoord = parseCoords(end);
  
    if (startCoord && endCoord) {
      setStartCoords(startCoord);
      setEndCoords(endCoord);
  
      // Mise à jour du centre et du zoom de la carte
      if (mapRef.current) {
        const bounds: L.LatLngTuple[] = [startCoord, endCoord];
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      alert("Invalid coordinates. Please enter in the format: latitude, longitude.");
    }
  };
  
  

  return (
    <div className="relative w-full z-1">
      {/* Barre de recherche */}
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

      {/* Carte Leaflet */}
      <MapContainer
        center={startCoords || [45.75, 4.85]} // Centre sur le point de départ ou sur Lyon par défaut
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

        {/* Marqueurs et trajet */}
        {startCoords && (
          <Marker position={startCoords}>
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        {endCoords && (
          <Marker position={endCoords}>
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

// Composant d'entrée réutilisable
const InputField = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (val: string) => void;
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default MapComponent;
