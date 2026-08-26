import { Parking } from "../types";
import { PARKINGS } from "../lib/constants";
import { sortParkingsByDestination } from "../lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const parkingService = {
  /**
   * Obtiene la lista de todos los parqueaderos.
   * Si la API falla o no está disponible, retorna los datos mock locales.
   */
  async listParkings(): Promise<Parking[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/parkings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error fetching parkings");
      return await response.json();
    } catch (error) {
      console.warn("NestJS API unavailable, using mock data for listParkings:", error);
      return PARKINGS;
    }
  },

  /**
   * Obtiene los parqueaderos más cercanos a un destino específico.
   * Si la API falla, calcula la cercanía localmente sobre los datos mock.
   */
  async listNearbyParkings(destination: string, limit = 5): Promise<Parking[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/parkings/nearby?destination=${encodeURIComponent(destination)}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error fetching nearby parkings");
      return await response.json();
    } catch (error) {
      console.warn("NestJS API unavailable, fallback to local distance calculation:", error);
      return sortParkingsByDestination(destination).slice(0, limit);
    }
  },

  /**
   * Obtiene la disponibilidad en tiempo real de un parqueadero específico.
   * Si la API falla, retorna la disponibilidad guardada en los mocks locales.
   */
  async getParkingAvailability(id: string, destination?: string): Promise<{ availability: number }> {
    try {
      const destQuery = destination ? `?destination=${encodeURIComponent(destination)}` : "";
      const response = await fetch(`${API_BASE_URL}/parkings/${id}/availability${destQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error fetching availability");
      return await response.json();
    } catch (error) {
      console.warn(`NestJS API unavailable, using mock availability for parking ${id}:`, error);
      const localParking = PARKINGS.find((p) => p.id === id);
      return { availability: localParking ? localParking.availability : 50 };
    }
  },

  /**
   * Obtiene la distancia entre un parqueadero y un destino.
   */
  async getParkingDistance(id: string, destination: string): Promise<{ distance: number; walk: number }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/parkings/${id}/distance?destination=${encodeURIComponent(destination)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error fetching distance");
      return await response.json();
    } catch (error) {
      console.warn(`NestJS API unavailable, using mock distance calculation for parking ${id}:`, error);
      const localParking = PARKINGS.find((p) => p.id === id);
      return {
        distance: localParking ? localParking.distance : 500,
        walk: localParking ? localParking.walk : 6,
      };
    }
  },
};
