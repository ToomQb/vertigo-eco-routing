import React, { useState, useEffect, useRef } from "react";
import { searchAddress, AddressResult } from "./utils";

interface Props {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (val: string) => void;
  onSelectSuggestion?: (label: string) => void;
}

const InputField: React.FC<Props> = ({ label, placeholder, value, setValue, onSelectSuggestion }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(async () => {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 3) {
        const results: AddressResult[] = await searchAddress(trimmedValue);

        const uniqueLabels = Array.from(new Set(results.map((r) => r.label)));

        if (uniqueLabels.length > 0) {
          setSuggestions(uniqueLabels);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, isTyping]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Defined as "writing" only if more than 2 non-empty characters
    setIsTyping(newValue.trim().length > 2);
  };


  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 100);
  };

  const handleSelect = (label: string) => {
    setIsTyping(false);
    setValue(label);
    setShowSuggestions(false);
    onSelectSuggestion?.(label);
  };

  return (
    <div className="relative">
      <label htmlFor="address" className="text-sm text-gray-600 dark:text-gray-300">{label}</label>
      <input
        id="address"
        ref={inputRef}
        className="w-full border px-3 py-2 rounded focus:outline-none mt-1"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={handleBlur}
      />
      {showSuggestions && (
        <ul className="absolute z-1000 bg-light dark:bg-gray-700 shadow-md w-full mt-1 rounded max-h-40 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputField;
