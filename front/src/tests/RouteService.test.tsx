import { describe, it, expect, vi, beforeEach } from "vitest";
import { findRoute, ExtendedRouteResult } from "../components/global/routeService";
import * as utils from "../components/global/utils";

// Mock global fetch
global.fetch = vi.fn();

describe("findRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error if addresses are invalid and cannot parse coords or geocode", async () => {
    vi.spyOn(utils, "parseCoords").mockReturnValue(null);
    vi.spyOn(utils, "geocodeAddress").mockResolvedValue(null);

    await expect(findRoute("invalidStart", "invalidEnd", "driving-car")).rejects.toThrow(
      "Invalid address or coordinates."
    );
  });

  it("uses parsed coordinates if valid", async () => {
    vi.spyOn(utils, "parseCoords")
      .mockImplementation((input) => (input === "start" ? [42, 2] : [46, 5]));
    vi.spyOn(utils, "geocodeAddress").mockResolvedValue(null); // won't be called

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [[4, 45], [4.1, 45.1]] }, // lon/lat order from API
              properties: { summary: { distance: 10000, duration: 900 } },
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => 150,
      } as Response);

    const result = await findRoute("start", "end", "driving-car");

    expect(result.startCoords).toEqual([42, 2]);
    expect(result.endCoords).toEqual([46, 5]);
    expect(result.routePoints).toEqual([[45, 4], [45.1, 4.1]]); // lat/lon
    expect(result.totalDistanceKm).toBe("10.00");
    expect(result.totalDurationMin).toBe(15);
    expect(Number(result.co2Emission)).toBeCloseTo((10 * 150) / 1000, 2);
    expect(Number(result.energy)).toBeCloseTo(10 * 0.06, 2);
  });

  it("uses geocodeAddress if parseCoords returns null", async () => {
    vi.spyOn(utils, "parseCoords").mockReturnValue(null);
    vi.spyOn(utils, "geocodeAddress")
      .mockImplementation(async (input) =>
        input === "start" ? [45, 4] : [46, 5]
      );

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [[4, 45], [4.1, 45.1]] },
              properties: { summary: { distance: 20000, duration: 1800 } },
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => 100,
      } as Response);

    const result = await findRoute("startAddress", "endAddress", "cycling-regular");

    expect(result.startCoords).toEqual([46, 5]);
    expect(result.endCoords).toEqual([46, 5]);
    expect(result.totalDistanceKm).toBe("20.00");
    expect(result.totalDurationMin).toBe(30);
    expect(Number(result.co2Emission)).toBeCloseTo((20 * 100) / 1000, 2);
    expect(result.energy).toBe("600"); // 20 km * 30 kcal/km
  });

  it("throws error if API returns non-ok response", async () => {
    vi.spyOn(utils, "parseCoords").mockReturnValue([45, 4]);
    vi.spyOn(utils, "geocodeAddress").mockResolvedValue(null);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(findRoute("start", "end", "foot-walking")).rejects.toThrow("API Error");
  });

  it("throws error if route coordinates are missing or malformed", async () => {
    vi.spyOn(utils, "parseCoords").mockReturnValue([45, 4]);
    vi.spyOn(utils, "geocodeAddress").mockResolvedValue(null);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        features: [{}], // no geometry or coordinates
      }),
    } as Response);

    await expect(findRoute("start", "end", "wheelchair")).rejects.toThrow(
      "Route coordinates are missing or malformed."
    );
  });

  it("returns 'N/A' for co2Emission if emission fetch fails", async () => {
    vi.spyOn(utils, "parseCoords").mockReturnValue([45, 4]);
    vi.spyOn(utils, "geocodeAddress").mockResolvedValue(null);

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [[4, 45], [4.1, 45.1]] },
              properties: { summary: { distance: 10000, duration: 900 } },
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
      } as Response);

    const result = await findRoute("start", "end", "foot-walking");
    expect(result.co2Emission).toBe("N/A");
  });

  it.each([
    ["driving-car", 0.06, "L"],
    ["cycling-regular", 30, "kcal"],
    ["wheelchair", 25, "kcal"],
    ["foot-walking", 1312, "steps"],
  ])("calculates energy for mode %s", async (mode, factor, unit) => {
    vi.spyOn(utils, "parseCoords").mockReturnValue([45, 4]);
    vi.spyOn(utils, "geocodeAddress").mockResolvedValue(null);

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [[4, 45], [4.1, 45.1]] },
              properties: { summary: { distance: 10000, duration: 900 } },
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => 100,
      } as Response);

    const result = await findRoute("start", "end", mode);

    const dist = parseFloat(result.totalDistanceKm);
    if (mode === "driving-car") {
      expect(Number(result.energy)).toBeCloseTo(dist * 0.06, 2);
    } else if (mode === "cycling-regular") {
      expect(result.energy).toBe((dist * 30).toFixed(0));
    } else if (mode === "wheelchair") {
      expect(result.energy).toBe((dist * 25).toFixed(0));
    } else if (mode === "foot-walking") {
      expect(result.energy).toBe(Math.round(dist * 1312).toString());
    }
  });
});
