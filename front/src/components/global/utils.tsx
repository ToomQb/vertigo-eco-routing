import { LatLngTuple } from "leaflet";

export const parseCoords = (input: string): LatLngTuple | null => {
  const regex = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
  const match = input.match(regex);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])] as LatLngTuple;
  }
  return null;
};
