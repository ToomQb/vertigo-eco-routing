import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { FaExchangeAlt } from "react-icons/fa";
import { LatLngExpression, LatLngTuple } from "leaflet";
import InputField from "./input-field";
import { parseCoords } from "./utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const INITIAL_START: LatLngTuple = [45.748, 4.824];
const INITIAL_END: LatLngTuple = [45.781, 4.868];

const MapComponent = () => {
  const [start, setStart] = useState("45.748, 4.824");
  const [end, setEnd] = useState("45.781, 4.868");
  const [startCoords, setStartCoords] = useState<LatLngExpression>(INITIAL_START);
  const [endCoords, setEndCoords] = useState<LatLngExpression>(INITIAL_END);
  const mapRef = useRef<L.Map | null>(null);

  const [contextMenu, setContextMenu] = useState({
    latlng: null as L.LatLng | null,
    visible: false,
    position: { x: 0, y: 0 },
  });

  const updateCoordinates = (latLng: L.LatLng, isStart: boolean) => {
    const coords: LatLngTuple = [latLng.lat, latLng.lng];
    isStart ? (setStartCoords(coords), setStart(`${latLng.lat}, ${latLng.lng}`))
            : (setEndCoords(coords), setEnd(`${latLng.lat}, ${latLng.lng}`));
  };

  const findRoute = () => {
    const s = parseCoords(start);
    const e = parseCoords(end);
    if (s && e) {
      setStartCoords(s);
      setEndCoords(e);
    } else {
      alert("Invalid coordinates. Use format: latitude, longitude.");
    }
  };

  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
  };

  useEffect(() => {
    if (mapRef.current && startCoords && endCoords) {
      mapRef.current.fitBounds([startCoords as LatLngTuple, endCoords as LatLngTuple], { padding: [50, 50] });
    }
  }, [startCoords, endCoords]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contextMenu.visible) e.preventDefault();
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, [contextMenu.visible]);

  return (
    <div className="relative w-full z-1">
      {/* UI Panel */}
      <div className="absolute top-16 left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-[300px] z-[1000]">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Plan your route</h2>
        <div className="relative flex flex-col gap-1.5">
        <InputField
          label="Starting point (lat, long)"
          placeholder="e.g., 45.75, 4.85"
          value={start}
          setValue={setStart}
        />
          <button
            onClick={swapAddresses}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 my-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaExchangeAlt className="text-gray-600 dark:text-gray-300" size={18} />
          </button>
          <InputField
            label="Destination (lat, long)"
            placeholder="e.g., 35.41, 139.41"
            value={end}
            setValue={setEnd}
          />
        </div>
        <button
          onClick={findRoute}
          className="w-full mt-3 bg-dark-green text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Find route
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={startCoords}
        zoom={13}
        className="w-full h-[calc(100vh-96px)]"
        attributionControl
        ref={(ref) => {
          mapRef.current = ref;
          ref?.on("contextmenu", (e: L.LeafletMouseEvent) => {
            const rect = ref.getContainer().getBoundingClientRect();
            setContextMenu({
              latlng: e.latlng,
              visible: true,
              position: {
                x: e.originalEvent.clientX - rect.left,
                y: e.originalEvent.clientY - rect.top,
              },
            });
          });
          ref?.on("click", () => setContextMenu((prev) => ({ ...prev, visible: false })));
        }}
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

        {/* Markers */}
        {startCoords && (
          <Marker
            position={startCoords}
            draggable
            eventHandlers={{ dragend: (e) => updateCoordinates(e.target.getLatLng(), true) }}
          >
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        {endCoords && (
          <Marker
            position={endCoords}
            draggable
            eventHandlers={{ dragend: (e) => updateCoordinates(e.target.getLatLng(), false) }}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}
        {startCoords && endCoords && (
          <Polyline positions={[startCoords, endCoords]} color="green" weight={4} opacity={0.7} />
        )}
      </MapContainer>

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.latlng && (
        <div
          className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md z-[2000]"
          style={{ top: contextMenu.position.y, left: contextMenu.position.x, padding: "0.5rem" }}
        >
          <div
            onClick={() => {
              updateCoordinates(contextMenu.latlng!, true);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
          >
            Set starting point
          </div>
          <div
            onClick={() => {
              updateCoordinates(contextMenu.latlng!, false);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
          >
            Set destination point
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
