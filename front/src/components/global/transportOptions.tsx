import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { FaWalking, FaCar, FaBicycle, FaWheelchair } from "react-icons/fa";

interface TransportOptionsProps {
  selectedMode: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "driving-car", icon: <FaCar className="h-6 w-6 text-dark-green" /> },
  { value: "cycling-regular", icon: <FaBicycle className="h-6 w-6 text-dark-green" /> },
  { value: "foot-walking", icon: <FaWalking className="h-6 w-6 text-dark-green" /> },
  { value: "wheelchair", icon: <FaWheelchair className="h-6 w-6 text-dark-green" /> },
];

const TransportOptions: React.FC<TransportOptionsProps> = ({ selectedMode, onChange }) => {
  return (
    <RadioGroup.Root
      value={selectedMode}
      onValueChange={onChange}
      className="max-w-sm w-full grid grid-cols-4 gap-3"
      aria-label="Select transport mode"
    >
      {options.map(({ value, icon }) => (
        <RadioGroup.Item
          key={value}
          value={value}
          aria-label={value}
          className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-[var(--dark-green)] cursor-pointer flex justify-center items-center"
        >
          <span className="tracking-tight">{icon}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default TransportOptions;
