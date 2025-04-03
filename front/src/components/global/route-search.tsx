"use client";

import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const RouteSearch = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState<LatLngExpression | null>(null);
  const [endCoords, setEndCoords] = useState<LatLngExpression | null>(null);

  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
  };

  const findRoute = () => {
    // Ici, nous allons parser les coordonnées d'exemple que l'utilisateur entre.
    const parseCoords = (input: string) => {
      const regex = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
      const match = input.match(regex);
      if (match) {
        return [parseFloat(match[1]), parseFloat(match[2])] as LatLngExpression;
      }
      return null;
    };

    const startCoord = parseCoords(start);
    const endCoord = parseCoords(end);

    if (startCoord && endCoord) {
      setStartCoords(startCoord);
      setEndCoords(endCoord);
    } else {
      alert("Invalid coordinates. Please enter coordinates in the format: latitude, longitude.");
    }
  };

  return (
    <div className="absolute top-72 left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-100 z-50">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Plan your route</h2>

      <div className="relative flex flex-col gap-1.5">
        <InputField label="Starting point (lat, long)" placeholder="e.g., 45.75, 4.85" value={start} setValue={setStart} />

        <button
          onClick={swapAddresses}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 my-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          <FaExchangeAlt className="text-gray-600 dark:text-gray-300" size={18} />
        </button>

        <InputField label="Destination (lat, long)" placeholder="e.g., 45.77, 4.87" value={end} setValue={setEnd} />
      </div>

      <button
        onClick={findRoute}
        className="w-full mt-3 bg-dark-green text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
      >
        Find route
      </button>

      {/* Map with route and markers */}
      {startCoords && endCoords && (
        <MapContainer center={startCoords} zoom={13} className="w-full h-[300px] mt-4">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={startCoords}>
            <Popup>Starting point</Popup>
          </Marker>
          <Marker position={endCoords}>
            <Popup>Destination</Popup>
          </Marker>
          <Polyline positions={[startCoords, endCoords]} color="blue" weight={4} opacity={0.7} />
        </MapContainer>
      )}
    </div>
  );
};

// Reusable component for input fields
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

export default RouteSearch;
