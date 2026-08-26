import { Parking, DestinationPoint } from "../types";
import { DESTINATIONS, PARKINGS, COLORS } from "./constants";

export function getDestinationPoint(name: string): DestinationPoint {
  return DESTINATIONS.find((destination) => destination.name.toLowerCase() === name.trim().toLowerCase()) ?? DESTINATIONS[0];
}

export function distanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDelta = toRad(latitude2 - latitude1);
  const lonDelta = toRad(longitude2 - longitude1);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRad(latitude1)) * Math.cos(toRad(latitude2)) *
      Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function distanceMeters(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) {
  return Math.round(distanceKm(latitude1, longitude1, latitude2, longitude2) * 1000);
}

export function sortParkingsByDestination(destino: string): Parking[] {
  const destination = getDestinationPoint(destino);
  return [...PARKINGS].sort(
    (left, right) =>
      distanceMeters(destination.latitude, destination.longitude, left.latitude, left.longitude) -
      distanceMeters(destination.latitude, destination.longitude, right.latitude, right.longitude),
  );
}

export function parkingDistanceToDestination(parking: Parking, destino: string): number {
  const destination = getDestinationPoint(destino);
  return distanceMeters(destination.latitude, destination.longitude, parking.latitude, parking.longitude);
}

export function statusColor(a: number) {
  if (a >= 75) return { c: COLORS.green, bg: COLORS.greenSoft, label: "Alta disponibilidad" };
  if (a >= 50) return { c: COLORS.orange, bg: COLORS.orangeSoft, label: "Disponibilidad media" };
  return { c: COLORS.red, bg: COLORS.redSoft, label: "Baja disponibilidad" };
}

export function money(n: number): string {
  return "$" + n.toLocaleString("es-CO");
}

export const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 999,
  background: "#F1F5F9",
  color: "#334155",
  fontSize: "12.5px",
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif"
};
