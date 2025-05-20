import {
  parseCoords,
  geocodeAddress,
  reverseGeocode,
  searchAddress,
  formatDuration,
  fetchAndSetAddress,
} from "../components/global/utils";

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("parseCoords", () => {
  it("parses valid coordinates", () => {
    expect(parseCoords("45.1234, 4.5678")).toEqual([45.1234, 4.5678]);
  });

  it("returns null for invalid input", () => {
    expect(parseCoords("hello world")).toBeNull();
    expect(parseCoords("")).toBeNull();
    expect(parseCoords("45.1234 4.5678")).toBeNull();
  });
});

describe("formatDuration", () => {
  it("formats duration correctly", () => {
    expect(formatDuration(125)).toBe("2h 5min");
    expect(formatDuration(45)).toBe("45min");
    expect(formatDuration(null)).toBe("");
  });
});

describe("geocodeAddress", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("returns first coordinate for single result", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => [
        { lat: "45.1234", lon: "4.5678", display_name: "Some place" },
      ],
    } as Response);

    const result = await geocodeAddress("Lyon");
    expect(result).toEqual([45.1234, 4.5678]);
  });

  it("returns multiple display names if 'multiple' is true", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => [
        { display_name: "Place A" },
        { display_name: "Place B" },
      ],
    } as Response);

    const result = await geocodeAddress("Lyon", true);
    expect(result).toEqual(["Place A", "Place B"]);
  });

  it("returns null if no results", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    const result = await geocodeAddress("Nowhere");
    expect(result).toBeNull();
  });
});

describe("reverseGeocode", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("returns full formatted address", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        address: {
          house_number: "12",
          road: "Main Street",
          postcode: "69000",
        },
      }),
    } as Response);

    const result = await reverseGeocode(45.75, 4.85);
    expect(result).toBe("12 Main Street 69000");
  });

  it("falls back to display_name if no address", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        display_name: "Fallback Name",
        address: {},
      }),
    } as Response);

    const result = await reverseGeocode(0, 0);
    expect(result).toBe("Fallback Name");
  });
});

describe("searchAddress", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("returns unique and filtered address results", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => [
        {
          lat: "45.1",
          lon: "4.2",
          address: {
            house_number: "10",
            road: "Rue des Lilas",
            city: "Lyon",
            postcode: "69000",
            country: "France",
          },
        },
        {
          lat: "45.1",
          lon: "4.2",
          address: {
            house_number: "10",
            road: "Rue des Lilas",
            city: "Lyon",
            postcode: "69000",
            country: "France",
          },
        },
      ],
    } as Response);

    const results = await searchAddress("Rue des Lilas");

    expect(results.length).toBe(1);
    expect(results[0].label).toBe("10 Rue des Lilas Lyon 69000 France");
    expect(results[0].lat).toBe("45.1");
  });

  it("does not deduplicate results with different labels", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => [
        {
          lat: "45.1",
          lon: "4.2",
          address: {
            house_number: "10",
            road: "Rue des Lilas",
            city: "Lyon",
            postcode: "69000",
            country: "France",
          },
        },
        {
          lat: "45.2",
          lon: "4.3",
          address: {
            house_number: "12",
            road: "Rue des Lilas",
            city: "Lyon",
            postcode: "69000",
            country: "France",
          },
        },
      ],
    } as Response);

    const results = await searchAddress("Rue des Lilas");

    expect(results.length).toBe(2);
    expect(results[0].label).toContain("10 Rue des Lilas");
    expect(results[1].label).toContain("12 Rue des Lilas");
  });
});

describe("fetchAndSetAddress", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("sets address using setter callback", async () => {
    const setter = vi.fn();

    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        address: { road: "Rue A", postcode: "12345" },
      }),
    } as Response);

    await fetchAndSetAddress([10, 20], setter);
    expect(setter).toHaveBeenCalledWith("Rue A 12345");
  });

  it("handles errors gracefully", async () => {
    const setter = vi.fn();
    vi.mocked(fetch).mockRejectedValueOnce(new Error("fail"));

    await fetchAndSetAddress([0, 0], setter);
    expect(setter).not.toHaveBeenCalled();
  });
});
