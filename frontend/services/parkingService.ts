import { AvailabilityResponse, NearbyParkingResponse, Parking } from "../types";
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
      const data = (await response.json()) as BackendParking[];
      return data.map((item) => normalizeBackendParking(item));
    } catch (error) {
      console.warn(
        "NestJS API unavailable, using mock data for listParkings:",
        error,
      );
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
        },
      );
      if (!response.ok) throw new Error("Error fetching nearby parkings");
      const data = (await response.json()) as NearbyParkingResponse[];
      return data.map((item) => normalizeParking(item));
    } catch (error) {
      console.warn(
        "NestJS API unavailable, fallback to local distance calculation:",
        error,
      );
      return sortParkingsByDestination(destination).slice(0, limit);
    }
  },

  /**
   * Obtiene la disponibilidad en tiempo real de un parqueadero específico.
   * Si la API falla, retorna la disponibilidad guardada en los mocks locales.
   */
  async getParkingAvailability(
    id: string,
    destination?: string,
  ): Promise<AvailabilityResponse> {
    try {
      const destQuery = destination
        ? `?destination=${encodeURIComponent(destination)}`
        : "";
      const response = await fetch(
        `${API_BASE_URL}/parkings/${id}/availability${destQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Error fetching availability");
      return (await response.json()) as AvailabilityResponse;
    } catch (error) {
      console.warn(
        `NestJS API unavailable, using mock availability for parking ${id}:`,
        error,
      );
      const localParking = PARKINGS.find((p) => p.id === id);
      const availability = localParking ? localParking.availability : 50;
      return {
        parkingId: id,
        parkingName: localParking?.name ?? "Parqueadero",
        currentAvailabilityPercent: availability,
        estimatedAvailabilityPercent: availability,
        confidencePercent: 0,
        explanation: "Mostrando datos locales mientras se conecta la API.",
        lastUpdatedAt: null,
      };
    }
  },

  /**
   * Obtiene la distancia entre un parqueadero y un destino.
   */
  async getParkingDistance(
    id: string,
    destination: string,
  ): Promise<{ distanceMeters: number; walkMinutes: number }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/parkings/${id}/distance?destination=${encodeURIComponent(destination)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Error fetching distance");
      const data = (await response.json()) as {
        distanceMeters: number;
        walkMinutes: number;
      };
      return data;
    } catch (error) {
      console.warn(
        `NestJS API unavailable, using mock distance calculation for parking ${id}:`,
        error,
      );
      const localParking = PARKINGS.find((p) => p.id === id);
      return {
        distanceMeters: localParking ? localParking.distance : 500,
        walkMinutes: localParking ? localParking.walk : 6,
      };
    }
  },
};

function normalizeParking(item: NearbyParkingResponse): Parking {
  const localParking = PARKINGS.find(
    (parking) => parking.id === item.parkingId,
  );

  return {
    ...(localParking ?? {
      id: item.parkingId,
      name: item.parkingName,
      availability: item.estimatedAvailabilityPercent,
      price: item.pricePerHour,
      distance: item.distanceMeters,
      walk: item.walkMinutes,
      x: 50,
      y: 50,
      latitude: 0,
      longitude: 0,
      scheduleLabel: "Horario no registrado",
      openingTime: "--:--",
      closingTime: "--:--",
      contactPhone: "No registrado",
      contactWhatsapp: "No registrado",
      contactAddress: "No registrada",
    }),
    name: item.parkingName,
    availability: item.estimatedAvailabilityPercent,
    price: item.pricePerHour,
    distance: item.distanceMeters,
    walk: item.walkMinutes,
  };
}

type BackendParking = {
  id: string;
  name: string;
  pricePerHour: number;
  mapX: number;
  mapY: number;
  latitude: number | null;
  longitude: number | null;
  scheduleLabel?: string;
  openingTime?: string | null;
  closingTime?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactAddress?: string | null;
};

function normalizeBackendParking(item: BackendParking): Parking {
  const localParking = PARKINGS.find((parking) => parking.id === item.id);

  return {
    ...(localParking ?? {
      id: item.id,
      name: item.name,
      availability: 50,
      price: item.pricePerHour,
      distance: 0,
      walk: 0,
      x: item.mapX,
      y: item.mapY,
      latitude: item.latitude ?? 0,
      longitude: item.longitude ?? 0,
      scheduleLabel: item.scheduleLabel ?? "Horario no registrado",
      openingTime: item.openingTime ?? "--:--",
      closingTime: item.closingTime ?? "--:--",
      contactPhone: item.contactPhone ?? "No registrado",
      contactWhatsapp: item.contactWhatsapp ?? "No registrado",
      contactAddress: item.contactAddress ?? "No registrada",
    }),
    name: item.name,
    price: item.pricePerHour,
    x: item.mapX,
    y: item.mapY,
    latitude: item.latitude ?? localParking?.latitude ?? 0,
    longitude: item.longitude ?? localParking?.longitude ?? 0,
  };
}
