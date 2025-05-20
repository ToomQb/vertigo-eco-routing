/// <reference types="vitest" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransportOptions from "../components/global/transportOptions";

describe("TransportOptions component", () => {
  it("renders all transport mode options", () => {
    const onChange = vi.fn();
    const selectedMode = "cycling-regular";

    render(<TransportOptions selectedMode={selectedMode} onChange={onChange} />);

    // We need to find the 4 radio buttons
    const carRadio = screen.getByRole("radio", { name: /driving-car/i });
    const bikeRadio = screen.getByRole("radio", { name: /cycling-regular/i });
    const walkRadio = screen.getByRole("radio", { name: /foot-walking/i });
    const wheelchairRadio = screen.getByRole("radio", { name: /wheelchair/i });

    expect(carRadio).toBeInTheDocument();
    expect(bikeRadio).toBeInTheDocument();
    expect(walkRadio).toBeInTheDocument();
    expect(wheelchairRadio).toBeInTheDocument();

    // Checks that the value selected is the one passed in prop
    expect(bikeRadio).toBeChecked();
    expect(carRadio).not.toBeChecked();
  });

  it("calls onChange when a different mode is selected", () => {
    const onChange = vi.fn();
    const selectedMode = "cycling-regular";

    render(<TransportOptions selectedMode={selectedMode} onChange={onChange} />);

    // Simulates a click on the "driving-car" button
    const carRadio = screen.getByRole("radio", { name: /driving-car/i });
    fireEvent.click(carRadio);

    expect(onChange).toHaveBeenCalledWith("driving-car");
  });
});
