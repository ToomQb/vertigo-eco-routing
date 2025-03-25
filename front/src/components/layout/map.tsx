"use client";

import { MapContainer, TileLayer, LayersControl, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const position: LatLngExpression = [45.75, 4.85]; // Lyon

export default function Map() {
  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <MapContainer
        center={position}
        zoom={13}
        className="w-full h-full"
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
}
