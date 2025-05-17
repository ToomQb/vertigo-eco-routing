import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup, Polyline } from "react-leaflet";
import L, { LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import InputField from "./inputField";
import TransportOptions from "./transportOptions";
import RouteInfo from "./routeInfos";
import { geocodeAddress, reverseGeocode, fetchAndSetAddress } from "./utils";
import { findRoute } from "./routeService";

// Constants
const INITIAL_START : LatLngTuple = [45.74988, 4.82697];
const INITIAL_END : LatLngTuple = [45.78166, 4.86815];

type TransportMode = "foot-walking" | "driving-car" | "cycling-regular" | "wheelchair";

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
  const [selectedMode, setSelectedMode] = useState<TransportMode>("foot-walking");

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
    fetchAndSetAddress(INITIAL_START, setStart);
    fetchAndSetAddress(INITIAL_END, setEnd);
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
      { padding: [185, 185] }
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

  // Find route when addresses or selectedMode change
  useEffect(() => {
    if (start.trim() !== "" && end.trim() !== "") {
      fetchRoute();
    }
  }, [start, end, selectedMode]);

  // Update coordinates and address
  const setMarkerPositionAndAddress = async (latLng: L.LatLng, isStart: boolean) => {
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
  const fetchRoute = async () => {
    setIsLoading(true);
    try {
      const result = await findRoute(start, end, selectedMode);

      setRoutePoints(result.routePoints);
      setTotalDistance(result.totalDistanceKm);
      setTotalDuration(result.totalDurationMin);
      setStartCoords(result.startCoords);
      setEndCoords(result.endCoords);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        setMarkerPositionAndAddress(latLng, isStart);
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
          <TransportOptions onChange={(value: string) => setSelectedMode(value as TransportMode)} selectedMode={selectedMode} />
        </div>
        
        {/* Find route button */}
        <button
          onClick={fetchRoute}
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
         <RouteInfo
            totalDistance={totalDistance}
            totalDuration={totalDuration}
            co2Emission="20.34"
            energy="3420"
            selectedMode={selectedMode}
          />
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
              dragend: (e) => setMarkerPositionAndAddress(e.target.getLatLng(), true) 
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
              dragend: (e) => setMarkerPositionAndAddress(e.target.getLatLng(), false) 
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
              setMarkerPositionAndAddress(contextMenu.latlng!, true);
              hideContextMenu();
            }}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
          >
            Set starting point
          </div>
          
          <div
            onClick={() => {
              setMarkerPositionAndAddress(contextMenu.latlng!, false);
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