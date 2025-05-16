import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { FaWalking, FaCar, FaBicycle, FaWheelchair } from "react-icons/fa";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";

// Components
import InputField from "./input-field";

// Utils
import { geocodeAddress, parseCoords, reverseGeocode, formatDuration } from "./utils";

// Constants
const INITIAL_START : LatLngTuple = [45.7498895120524, 4.826977382148856];
const INITIAL_END : LatLngTuple = [45.7816645, 4.8681545];

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
  // State for addresses and coordinates
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [startCoords, setStartCoords] = useState<LatLngExpression>(INITIAL_START);
  const [endCoords, setEndCoords] = useState<LatLngExpression>(INITIAL_END);
  const [routePoints, setRoutePoints] = useState<LatLngTuple[]>([]);
  const [totalDistance, setTotalDistance] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>("foot-walking");

  const options = [
    {
      value: "driving-car",
      icon: <FaCar className="h-6 w-6 text-dark-green" />,
    },
    {
      value: "cycling-regular",
      icon: <FaBicycle className="h-6 w-6 text-dark-green" />,
    },
    {
      value: "foot-walking",
      icon: <FaWalking className="h-6 w-6 text-dark-green" />,
    },
    {
      value: "wheelchair",
      icon: <FaWheelchair className="h-6 w-6 text-dark-green" />,
    },
  ];

  // Map reference
  const mapRef = useRef<L.Map | null>(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    latlng: null,
    visible: false,
    position: { x: 0, y: 0 },
  });
  const [clickedAddress, setClickedAddress] = useState<string | null>(null);

  // Initialize addresses from coordinates
  useEffect(() => {
    const fetchInitialAddresses = async () => {
      try {
        const startAddress = await reverseGeocode(INITIAL_START[0], INITIAL_START[1]);
        const endAddress = await reverseGeocode(INITIAL_END[0], INITIAL_END[1]);
        setStart(startAddress);
        setEnd(endAddress);
      } catch (err) {
        console.error("Error during initial reverse geocoding:", err);
      }
    };
    fetchInitialAddresses();
  }, []);

  // Fetch address when context menu is shown
  useEffect(() => {
    if (!contextMenu.latlng) return;
    
    reverseGeocode(contextMenu.latlng.lat, contextMenu.latlng.lng)
      .then(setClickedAddress)
      .catch(() => setClickedAddress("Unknown address"));
  }, [contextMenu.latlng]);

  // Update map bounds when coordinates change
  useEffect(() => {
    if (!mapRef.current || !startCoords || !endCoords) return;
    
    mapRef.current.fitBounds(
      [startCoords as LatLngTuple, endCoords as LatLngTuple], 
      { padding: [150, 150] }
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

  // Find route when addresses change
  useEffect(() => {
    if (start.trim() !== "" && end.trim() !== "") {
      findRoute();
    }
  }, [start, end]);

  // Update coordinates and address
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
      
      // Update address in input field
      if (isStart) {
        setStart(address);
      } else {
        setEnd(address);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };
  
  // Find route based on inputs
  const findRoute = async () => {
    setIsLoading(true);
    try {
      const startAsCoords = parseCoords(start);
      const endAsCoords = parseCoords(end);
  
      let startLatLng: LatLngTuple;
      let endLatLng: LatLngTuple;
  
      if (startAsCoords && endAsCoords) {
        startLatLng = startAsCoords;
        endLatLng = endAsCoords;
      } else {
        const startFromGeocode = await geocodeAddress(start);
        const endFromGeocode = await geocodeAddress(end);
  
        if (
          startFromGeocode &&
          endFromGeocode &&
          Array.isArray(startFromGeocode) &&
          Array.isArray(endFromGeocode) &&
          typeof startFromGeocode[0] === "number" &&
          typeof endFromGeocode[0] === "number"
        ) {
          startLatLng = startFromGeocode as LatLngTuple;
          endLatLng = endFromGeocode as LatLngTuple;
        } else {
          alert("Invalid address or coordinates.");
          return;
        }
      }
  
      setStartCoords(startLatLng);
      setEndCoords(endLatLng);
  
      // Send coordinates as [lng, lat] arrays
      const response = await fetch("http://localhost:3002/routes/calculate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: [startLatLng[1], startLatLng[0]],  // [lng, lat] (reversed order)
          end: [endLatLng[1], endLatLng[0]],        // [lng, lat] (reversed order)
          transport_mode: selectedMode // Pass selected modes
        }),
      });
  
      if (!response.ok) {
        throw new Error("API Error");
      }
  
      const data = await response.json();
  
      // Verify and transform coordinates
      const routeCoordinates = data.features[0]?.geometry?.coordinates;
      const summary = data.features[0].properties.summary;

      const totalDistanceKm = (summary.distance / 1000).toFixed(2); // in kilometers
      const totalDurationMin = Math.round(summary.duration / 60);   // in minutes

      setTotalDistance(totalDistanceKm);
      setTotalDuration(totalDurationMin);
      
      if (routeCoordinates && Array.isArray(routeCoordinates)) {
        const latLngArray: LatLngTuple[] = routeCoordinates.map((coord: number[]) => {
          // Convert [lng, lat] to [lat, lng]
          return [coord[1], coord[0]];  // [lat, lng] (correct order for Leaflet)
        });
  
        setRoutePoints(latLngArray);
      } else {
        console.error("Route coordinates are missing or malformed.");
        alert("Error in coordinate format.");
      }
    } catch (error) {
      console.error("Error in findRoute:", error);
      alert("Error calculating route.");
    } finally {
      setIsLoading(false);
    }
  };

  // Swap start and end addresses
  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
    
    // Also swap coordinates
    const tempCoords = startCoords;
    setStartCoords(endCoords);
    setEndCoords(tempCoords);
  };

  // Handle address selection from suggestions
  const handleAddressSelection = async (label: string, isStart: boolean) => {
    try {
      const coords = await geocodeAddress(label);
      
      if (!coords || !Array.isArray(coords)) {
        throw new Error("Invalid coordinates returned");
      }
      
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
  
  // Handle map context menu (right-click)
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
  
  // Hide context menu on map click
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
            placeholder="e.g., 123 Main Street"
            value={start}
            setValue={setStart}
            onSelectSuggestion={(label) => handleAddressSelection(label, true)}
          />
          
          {/* Destination input */}
          <InputField
            label="Destination (lat, long)"
            placeholder="e.g., City Center"
            value={end}
            setValue={setEnd}
            onSelectSuggestion={(label) => handleAddressSelection(label, false)}
          />
        </div>

        {/* Transport options */}
        <div id="transport-options" className="flex mt-4 mb-2">
          <RadioGroup.Root
            value={selectedMode}
            onValueChange={setSelectedMode}
            className="max-w-sm w-full grid grid-cols-4 gap-3"
          >
            {options.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-[var(--dark-green)]"
              >
                <span className="tracking-tight">{option.icon}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </div>
        
        {/* Find route button */}
        <button
          onClick={findRoute}
          disabled={isLoading}
          className={`w-full mt-3 py-2 rounded-lg text-white transition
            ${isLoading 
              ? 'bg-green opacity-70 cursor-not-allowed' 
              : 'bg-dark-green hover:bg-green cursor-pointer'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Calculating route...
            </div>
          ) : (
            "Find route"
          )}
        </button>

        {routePoints && routePoints.length > 1 && (
          <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
            Distance: {totalDistance} km<br />
            Duration: {formatDuration(totalDuration)}
          </div>
        )}
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
        {routePoints && routePoints.length > 1 && (
          <Polyline positions={routePoints} color="green" weight={4}  />
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
            {clickedAddress || "Loading..."}
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