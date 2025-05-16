// src/services/routeService.tsx
import { LatLngTuple } from "leaflet";
import { geocodeAddress } from "./utils"; // ou ton fichier réel
import { parseCoords } from "./utils"; // ou ton fichier réel

export interface RouteResult {
  routePoints: LatLngTuple[];
  totalDistanceKm: string;
  totalDurationMin: number;
  startCoords: LatLngTuple;
  endCoords: LatLngTuple;
}

export const findRoute = async (
  start: string,
  end: string,
  selectedMode: string
): Promise<RouteResult> => {
  let startLatLng: LatLngTuple;
  let endLatLng: LatLngTuple;

  const startAsCoords = parseCoords(start);
  const endAsCoords = parseCoords(end);

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
      throw new Error("Invalid address or coordinates.");
    }
  }

  const response = await fetch("http://localhost:3002/routes/calculate/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start: [startLatLng[1], startLatLng[0]],
      end: [endLatLng[1], endLatLng[0]],
      transport_mode: selectedMode,
    }),
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  const data = await response.json();

  const routeCoordinates = data.features[0]?.geometry?.coordinates;
  const summary = data.features[0].properties.summary;

  const totalDistanceKm = (summary.distance / 1000).toFixed(2);
  const totalDurationMin = Math.round(summary.duration / 60);

  if (!routeCoordinates || !Array.isArray(routeCoordinates)) {
    throw new Error("Route coordinates are missing or malformed.");
  }

  const routePoints: LatLngTuple[] = routeCoordinates.map((coord: number[]) => [
    coord[1],
    coord[0],
  ]);

  return {
    routePoints,
    totalDistanceKm,
    totalDurationMin,
    startCoords: startLatLng,
    endCoords: endLatLng,
  };
};
