// src/services/routeService.tsx
import { LatLngTuple } from "leaflet";
import { geocodeAddress, parseCoords } from "./utils";

export interface RouteResult {
  routePoints: LatLngTuple[];
  totalDistanceKm: string;
  totalDurationMin: number;
  startCoords: LatLngTuple;
  endCoords: LatLngTuple;
}

export interface ExtendedRouteResult extends RouteResult {
  co2Emission: string;
  energy: string | null;
}

export const findRoute = async (
  start: string,
  end: string,
  selectedMode: string
): Promise<ExtendedRouteResult> => {
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes/calculate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start: [startLatLng[1], startLatLng[0]],
      end: [endLatLng[1], endLatLng[0]],
      transport_mode: selectedMode,
    }),
  });

  if (!response.ok) {
    console.log("error fetching:", `${process.env.NEXT_PUBLIC_API_URL}/routes/calculate/`)
    throw new Error("API Error");
  }

  const data = await response.json();

  if (!data.features?.[0] || !data.features[0].properties?.summary) {
    throw new Error("Route coordinates are missing or malformed.");
  }

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

  const emissionResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/routes/emission_co2/${selectedMode}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  let co2Emission = "N/A";

  if (emissionResponse.ok) {
    const emissionFactor: number = await emissionResponse.json();
    const emissionKg = (parseFloat(totalDistanceKm) * (emissionFactor / 1000));
    co2Emission = emissionKg.toFixed(2);
  }

  let energy: string | null = null;

  if (selectedMode === "driving-car") {
    const fuelPerKm = 0.06; // L/km
    energy = (parseFloat(totalDistanceKm) * fuelPerKm).toFixed(2); // L
  } else if (selectedMode === "cycling-regular") {
    const kcalPerKm = 30;
    energy = (parseFloat(totalDistanceKm) * kcalPerKm).toFixed(0); // kcal
  } else if (selectedMode === "wheelchair") {
    const kcalPerKm = 25;
    energy = (parseFloat(totalDistanceKm) * kcalPerKm).toFixed(0); // kcal
  } else if (selectedMode === "foot-walking") {
    const stepsPerKm = 1312;
    energy = Math.round(parseFloat(totalDistanceKm) * stepsPerKm).toString(); // steps
  }

  return {
    routePoints,
    totalDistanceKm,
    totalDurationMin,
    startCoords: startLatLng,
    endCoords: endLatLng,
    co2Emission,
    energy,
  };
};
