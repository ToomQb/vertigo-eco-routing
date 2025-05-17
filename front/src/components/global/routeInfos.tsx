import React from "react";
import { FaRoad, FaClock, FaLeaf, FaGasPump, FaFire, FaShoePrints } from "react-icons/fa";
import { formatDuration } from "./utils";

interface RouteInfoProps {
  totalDistance: string | null;
  totalDuration: number | null;
  co2Emission?: string;
  energy?: string;
  selectedMode: string;
}

const RouteInfo: React.FC<RouteInfoProps> = ({
  totalDistance,
  totalDuration,
  co2Emission,
  energy,
  selectedMode,
}) => {
  return (
    <div className="mt-4 text-sm text-gray-700 dark:text-gray-200 flex justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FaRoad className="text-dark-green" />
          <span className="font-medium">{totalDistance ?? "N/A"} km</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-dark-green" />
          <span className="font-medium">{formatDuration(totalDuration)}</span>
        </div>
      </div>
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-2 justify-start">
          <FaLeaf className="text-dark-green" />
          <span className="font-medium">{co2Emission ?? "N/A"} kg CO₂</span>
        </div>

        <div className="flex items-center gap-2 justify-end">
          {selectedMode === "driving-car" && (
            <>
              <FaGasPump className="text-dark-green" />
              <span className="font-medium">{energy ?? "N/A"} L estimés</span>
            </>
          )}
          {selectedMode === "cycling-regular" && (
            <>
              <FaFire className="text-dark-green" />
              <span className="font-medium">{energy ?? "N/A"} kcal brûlées</span>
            </>
          )}
          {selectedMode === "foot-walking" && (
            <>
              <FaShoePrints className="text-dark-green" />
              <span className="font-medium">{energy ?? "N/A"} pas estimés</span>
            </>
          )}
          {selectedMode === "wheelchair" && (
            <>
              <FaFire className="text-dark-green" />
              <span className="font-medium">{energy ?? "N/A"} kcal brûlées</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;
