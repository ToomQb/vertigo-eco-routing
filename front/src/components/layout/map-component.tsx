import React from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const position: LatLngExpression = [45.75, 4.85]; // Lyon

const MapComponent = () => {
  return (
    <div className="relative w-full z-1">
      <MapContainer
        center={position}
        zoom={13}
        className="w-full h-[calc(100vh-96px)]"
        attributionControl={true}
        preferCanvas={true}
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
        <Marker position={position}>
          <Popup>On est à Lyon</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
