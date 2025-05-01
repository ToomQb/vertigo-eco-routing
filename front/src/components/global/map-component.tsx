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
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Components
import InputField from "./input-field";

// Utils
import { geocodeAddress, parseCoords, reverseGeocode } from "./utils";

// Constants
const INITIAL_START: LatLngTuple = [45.748, 4.824];
const INITIAL_END: LatLngTuple = [45.781, 4.868];

// Default Leaflet icon setup
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Types
interface ContextMenuState {
  latlng: L.LatLng | null;
  visible: boolean;
  position: { x: number; y: number };
}

const MapComponent: React.FC = () => {
  // State for addresses
  const [start, setStart] = useState<string>("45.748, 4.824");
  const [end, setEnd] = useState<string>("45.781, 4.868");
  
  // State for coordinates
  const [startCoords, setStartCoords] = useState<LatLngExpression>(INITIAL_START);
  const [endCoords, setEndCoords] = useState<LatLngExpression>(INITIAL_END);
  
  // Map reference
  const mapRef = useRef<L.Map | null>(null);
  
  // Context menu for right-click actions
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    latlng: null,
    visible: false,
    position: { x: 0, y: 0 },
  });
  
  // Address displayed in context menu
  const [clickedAddress, setClickedAddress] = useState<string | null>(null);

  // Fetch address when context menu is shown
  useEffect(() => {
    if (!contextMenu.latlng) return;
    
    reverseGeocode(contextMenu.latlng.lat, contextMenu.latlng.lng)
      .then(setClickedAddress)
      .catch(() => setClickedAddress("Adresse inconnue"));
  }, [contextMenu.latlng]);

  // Update map bounds when coordinates change
  useEffect(() => {
    if (!mapRef.current || !startCoords || !endCoords) return;
    
    mapRef.current.fitBounds(
      [startCoords as LatLngTuple, endCoords as LatLngTuple], 
      { padding: [50, 50] }
    );
  }, [startCoords, endCoords]);

  // Prevent default context menu on right-click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contextMenu.visible) e.preventDefault();
    };
    
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, [contextMenu.visible]);

  /**
   * Updates coordinates and address when marker is moved or context menu option is selected
   */
  const updateCoordinates = async (latLng: L.LatLng, isStart: boolean) => {
    const coords: LatLngTuple = [latLng.lat, latLng.lng];
    
    // Update coordinates
    if (isStart) {
      setStartCoords(coords);
    } else {
      setEndCoords(coords);
    }
    
    // Reverse geocode to get address
    try {
      const address = await reverseGeocode(latLng.lat, latLng.lng);
      
      // Update address input
      if (isStart) {
        setStart(address);
      } else {
        setEnd(address);
      }
    } catch (error) {
      console.error("Failed to reverse geocode:", error);
    }
  };
  
  /**
   * Find route based on input addresses/coordinates
   */
  /**
   * Find route based on input addresses/coordinates
   */
  const findRoute = async () => {
    // Try to parse as coordinates first
    const startAsCoords = parseCoords(start);
    const endAsCoords = parseCoords(end);
    
    if (startAsCoords && endAsCoords) {
      // Both inputs are valid coordinates
      setStartCoords(startAsCoords);
      setEndCoords(endAsCoords);
      return;
    }
    
    try {
      // Try geocoding inputs as addresses
      const startFromGeocode = await geocodeAddress(start);
      const endFromGeocode = await geocodeAddress(end);
      
      // Verify we have valid coordinate results
      if (startFromGeocode && endFromGeocode && 
          Array.isArray(startFromGeocode) && Array.isArray(endFromGeocode) &&
          typeof startFromGeocode[0] === 'number' && typeof endFromGeocode[0] === 'number') {
        
        setStartCoords(startFromGeocode as LatLngTuple);
        setEndCoords(endFromGeocode as LatLngTuple);
      } else {
        alert("Invalid address or coordinates.");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      alert("Error finding route. Please check your inputs.");
    }
  };

  /**
   * Swap start and end addresses
   */
  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
    
    // Also swap the coords
    const tempCoords = startCoords;
    setStartCoords(endCoords);
    setEndCoords(tempCoords);
  };

  /**
   * Handle address selection from suggestions
   */
  const handleAddressSelection = async (label: string, isStart: boolean) => {
    try {
      const coords = await geocodeAddress(label);
      
      // Ensure we have valid coordinates (not strings or null)
      if (!coords || !Array.isArray(coords)) {
        throw new Error("Invalid coordinates returned");
      }
      
      // Check if this is a LatLngTuple (array of numbers) and not an array of strings
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        const latLng = L.latLng(coords[0], coords[1]);
        updateCoordinates(latLng, isStart);
      } else {
        throw new Error("Coordinates in incorrect format");
      }
    } catch (err) {
      console.error("Invalid address:", err);
    }
  };
  
  /**
   * Handle map context menu (right-click)
   */
  const handleContextMenu = (e: L.LeafletMouseEvent) => {
    const rect = mapRef.current?.getContainer().getBoundingClientRect();
    if (!rect) return;
    
    setContextMenu({
      latlng: e.latlng,
      visible: true,
      position: {
        x: e.originalEvent.clientX - rect.left,
        y: e.originalEvent.clientY - rect.top,
      },
    });
  };
  
  /**
   * Hide context menu on map click
   */
  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="relative w-full z-1">
      {/* UI Panel */}
      <div className="absolute top-16 left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-[300px] z-[1000]">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Plan your route
        </h2>
        
        <div className="relative flex flex-col gap-1.5">
          {/* Starting point input */}
          <InputField
            label="Starting point (lat, long)"
            placeholder="e.g., 45.75, 4.85"
            value={start}
            setValue={setStart}
            onSelectSuggestion={(label) => handleAddressSelection(label, true)}
          />
          
          {/* Swap button */}
          <button
            onClick={swapAddresses}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 my-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
            aria-label="Swap addresses"
          >
            <FaExchangeAlt className="text-gray-600 dark:text-gray-300" size={18} />
          </button>
          
          {/* Destination input */}
          <InputField
            label="Destination (lat, long)"
            placeholder="e.g., 35.41, 139.41"
            value={end}
            setValue={setEnd}
            onSelectSuggestion={(label) => handleAddressSelection(label, false)}
          />
        </div>
        
        {/* Find route button */}
        <button
          onClick={findRoute}
          className="w-full mt-3 bg-dark-green text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
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
          if (!ref) return;
          mapRef.current = ref;
          ref.on("contextmenu", handleContextMenu);
          ref.on("click", hideContextMenu);
        }}
      >
        {/* Map layer controls */}
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

        {/* Starting point marker */}
        {startCoords && (
          <Marker
            position={startCoords}
            draggable
            eventHandlers={{ 
              dragend: (e) => updateCoordinates(e.target.getLatLng(), true) 
            }}
          >
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        
        {/* Destination marker */}
        {endCoords && (
          <Marker
            position={endCoords}
            draggable
            eventHandlers={{ 
              dragend: (e) => updateCoordinates(e.target.getLatLng(), false) 
            }}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}
        
        {/* Route line */}
        {startCoords && endCoords && (
          <Polyline 
            positions={[startCoords, endCoords]} 
            color="green" 
            weight={4} 
            opacity={0.7} 
          />
        )}
      </MapContainer>

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.latlng && (
        <div
          className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md z-[2000]"
          style={{ 
            top: contextMenu.position.y, 
            left: contextMenu.position.x, 
            padding: "0.5rem" 
          }}
        >
          <div className="text-sm italic px-2 py-1">
            {clickedAddress || "Chargement..."}
          </div>

          <div
            onClick={() => {
              updateCoordinates(contextMenu.latlng!, true);
              hideContextMenu();
            }}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
          >
            Set starting point
          </div>
          
          <div
            onClick={() => {
              updateCoordinates(contextMenu.latlng!, false);
              hideContextMenu();
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