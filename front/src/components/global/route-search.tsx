"use client";

import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";

const RouteSearch = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const swapAddresses = () => {
    setStart(end);
    setEnd(start);
  };

  return (
    <div className="absolute top-72 left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-100 z-50">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Rechercher un itinéraire</h2>

      <div className="relative flex flex-col gap-1.5">
        <InputField label="Adresse de départ" placeholder="Ex: 10 rue de Rivoli, Paris" value={start} setValue={setStart} />

        <button 
            onClick={swapAddresses} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 my-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
            <FaExchangeAlt className="text-gray-600 dark:text-gray-300" size={18} />
        </button>

        <InputField label="Adresse d'arrivée" placeholder="Ex: Tour Eiffel, Paris" value={end} setValue={setEnd} />
      </div>

      <button 
        className="w-full mt-3 bg-dark-green text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
      >
        Calculer l'itinéraire
      </button>
    </div>
  );
};

// Composant réutilisable pour les champs d'entrée
const InputField = ({ label, placeholder, value, setValue }: { label: string; placeholder: string; value: string; setValue: (val: string) => void }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default RouteSearch;
