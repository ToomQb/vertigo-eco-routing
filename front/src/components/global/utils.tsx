import { LatLngTuple } from "leaflet";

export const parseCoords = (input: string): LatLngTuple | null => {
  const regex = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
  const match = input.match(regex);
  return match ? [parseFloat(match[1]), parseFloat(match[2])] : null;
};

export interface Address {
  house_number?: string;
  road?: string;
  city?: string;
  [key: string]: any;
}

export interface NominatimResult {
  address: Address;
  lat: string;
  lon: string;
  display_name?: string;
  [key: string]: any;
}

export interface AddressResult {
  label: string;
  lat: string;
  lon: string;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function geocodeAddress(query: string, multiple = false): Promise<LatLngTuple | string[] | null> {
  const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
  const res = await fetch(url);
  const data: any[] = await res.json();

  if (multiple) return data.map((r) => r.display_name);
  if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  return null;
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  const data: NominatimResult = await res.json();

  const { house_number, road, postcode } = data.address ?? {};

  if (house_number && road && postcode) return `${house_number} ${road} ${postcode}`;
  if (road && postcode) return `${road} ${postcode}`;
  if (road) return road;

  return data.display_name || "Adresse inconnue";
}

export async function searchAddress(query: string): Promise<AddressResult[]> {
  const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
  const res = await fetch(url);
  const data: NominatimResult[] = await res.json();

  const results = data.map((result) => {
    const addressParts = [
      result.address.house_number,
      result.address.road,
      result.address.suburb,
      result.address.city || result.address.town || result.address.village,
      result.address.postcode,
      result.address.country,
    ].filter(Boolean); // Remove undefined/null parts

    return {
      label: addressParts.join(", "),
      lat: result.lat,
      lon: result.lon,
    };
  });

  // Only keep results with decent label length
  const filtered = results.filter((r) => r.label && r.label.length > 10);

  // Remove duplicates by label
  const unique = Array.from(new Map(filtered.map((r) => [r.label, r])).values());

  return unique;
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
}

export const fetchAndSetAddress = async (coords: LatLngTuple, setter: (addr: string) => void) => {
  try {
    const address = await reverseGeocode(coords[0], coords[1]);
    setter(address);
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
  }
};
