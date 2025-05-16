"use client";

import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Chargement dynamique du composant Map avec désactivation du SSR
const MapWithNoSSR = dynamic(
  () => import("./mapComponent"),
  {
    ssr: false, // Désactive le rendu côté serveur
    loading: () => <p>Chargement de la carte...</p>
  }
);

export default function Map() {
  return <MapWithNoSSR />;
}
