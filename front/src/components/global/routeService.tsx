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

async function resolveLatLng(addressOrCoords: string): Promise<LatLngTuple> {
  const coords = parseCoords(addressOrCoords);
  if (coords) return coords;

  const geocoded = await geocodeAddress(addressOrCoords);
  if (
    geocoded &&
    Array.isArray(geocoded) &&
    typeof geocoded[0] === "number" &&
    typeof geocoded[1] === "number"
  ) {
    return geocoded as LatLngTuple;
  }

  throw new Error("Invalid address or coordinates.");
}

async function fetchRoute(
  startLatLng: LatLngTuple,
  endLatLng: LatLngTuple,
  mode: string
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes/calculate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start: [startLatLng[1], startLatLng[0]],
      end: [endLatLng[1], endLatLng[0]],
      transport_mode: mode,
    }),
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  const data = await response.json();

  const feature = data.features?.[0];
  if (!feature || !feature.properties?.summary) {
    throw new Error("Route coordinates are missing or malformed.");
  }

  const coords = feature.geometry?.coordinates;
  if (!coords || !Array.isArray(coords)) {
    throw new Error("Route coordinates are missing or malformed.");
  }

  return { coords, summary: feature.properties.summary };
}

// Calcul de l’émission CO2
async function fetchCO2Emission(distanceKm: number, mode: string): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/routes/emission_co2/${mode}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
    if (!res.ok) return "N/A";

    const emissionFactor: number = await res.json();
    const emissionKg = distanceKm * (emissionFactor / 1000);
    return emissionKg.toFixed(2);
  } catch {
    return "N/A";
  }
}

function calculateEnergy(mode: string, distanceKm: number): string | null {
  switch (mode) {
    case "driving-car":
      return (distanceKm * 0.06).toFixed(2); // L
    case "cycling-regular":
      return (distanceKm * 30).toFixed(0); // kcal
    case "wheelchair":
      return (distanceKm * 25).toFixed(0); // kcal
    case "foot-walking":
      return Math.round(distanceKm * 1312).toString(); // steps
    default:
      return null;
  }
}

export const findRoute = async (
  start: string,
  end: string,
  selectedMode: string
): Promise<ExtendedRouteResult> => {
  const startLatLng = await resolveLatLng(start);
  const endLatLng = await resolveLatLng(end);

  const { coords: routeCoordinates, summary } = await fetchRoute(
    startLatLng,
    endLatLng,
    selectedMode
  );

  const totalDistanceKm = (summary.distance / 1000).toFixed(2);
  const totalDurationMin = Math.round(summary.duration / 60);

  const routePoints: LatLngTuple[] = routeCoordinates.map(
    (coord: number[]) => [coord[1], coord[0]]
  );

  const co2Emission = await fetchCO2Emission(parseFloat(totalDistanceKm), selectedMode);
  const energy = calculateEnergy(selectedMode, parseFloat(totalDistanceKm));

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
