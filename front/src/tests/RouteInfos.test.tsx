/// <reference types="vitest" />
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RouteInfo from "../components/global/routeInfos";

describe("RouteInfo component", () => {
  it("renders default info with null props", () => {
    render(
        <RouteInfo
        totalDistance={null}
        totalDuration={null}
        co2Emission={null}
        energy={null}
        selectedMode="driving-car"
        />
    );

    expect(screen.getByText(/N\/A km/)).toBeInTheDocument();
    expect(screen.getByText(/N\/A kg CO₂/)).toBeInTheDocument();
    expect(screen.getByText(/N\/A L estimés/)).toBeInTheDocument();

    // Check that no formatted times are displayed
    expect(screen.queryByText(/\d+h/)).toBeNull();
    expect(screen.queryByText(/\d+min/)).toBeNull();
    });

  it("renders distance, formatted duration and co2Emission correctly", () => {
    render(
      <RouteInfo
        totalDistance="12.3"
        totalDuration={125}
        co2Emission="5.6"
        energy="3.5"
        selectedMode="driving-car"
      />
    );

    expect(screen.getByText("12.3 km")).toBeInTheDocument();
    expect(screen.getByText("2h 5min")).toBeInTheDocument(); // 125 min = 2h 5min
    expect(screen.getByText("5.6 kg CO₂")).toBeInTheDocument();
    expect(screen.getByText("3.5 L estimés")).toBeInTheDocument();
  });

  it('renders correct energy label depending on selectedMode', () => {
    const modesWithExpectedLabels = [
      { mode: 'driving-car', expectedText: /100 L estimés/ },
      { mode: 'cycling-regular', expectedText: /100 kcal brûlées/ },
      { mode: 'foot-walking', expectedText: /100 pas estimés/ },
      { mode: 'wheelchair', expectedText: /100 kcal brûlées/ },
    ];

    modesWithExpectedLabels.forEach(({ mode, expectedText }) => {
      render(
        <RouteInfo
          totalDistance="10"
          totalDuration={60}
          co2Emission="5"
          energy="100"
          selectedMode={mode}
        />
      );

      // Recherche tous les éléments avec ce texte
      const elements = screen.getAllByText(expectedText);

      // On vérifie qu'au moins un élément correspond
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();

      // Nettoyer le rendu entre chaque cas
      // Sinon, il empile les rendus et on a plusieurs copies
      document.body.innerHTML = '';
    });
  });
});
