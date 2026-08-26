import { DestinationPoint, Parking } from "../types";

export const COLORS = {
  navy: "#0F2A4A",
  navySoft: "#1B3A5C",
  blue: "#2F6FED",
  blueSoft: "#EAF1FF",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  border: "#E2E8F0",
  text: "#0F172A",
  textMuted: "#64748B",
  purple: "#8B5CF6",
  purpleSoft: "#F5F3FF",
  green: "#10B981",
  greenSoft: "#D1FAE5",
  orange: "#F59E0B",
  orangeSoft: "#FEF3C7",
  red: "#EF4444",
  redSoft: "#FEE2E2",
};

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

export const DESTINATIONS: DestinationPoint[] = [
  { name: "Universidad de Medellín", latitude: Number("6.2312"), longitude: Number("-75.6113") },
  { name: "Universidad Nacional", latitude: Number("6.2679"), longitude: Number("-75.5697") },
  { name: "Centro Comercial Viva Envigado", latitude: Number("6.1749"), longitude: Number("-75.587") },
  { name: "Parque de El Poblado", latitude: Number("6.2154"), longitude: Number("-75.5678") },
  { name: "Terminal del Sur", latitude: Number("6.1915"), longitude: Number("-75.5919") },
  { name: "Universidad Pontificia Bolivariana", latitude: Number("6.2444"), longitude: Number("-75.5891") },
  { name: "Centro Comercial Santafé", latitude: Number("6.2188"), longitude: Number("-75.5696") },
  { name: "Aeropuerto Olaya Herrera", latitude: Number("6.2168"), longitude: Number("-75.5901") },
  { name: "Plaza Mayor Medellín", latitude: Number("6.2319"), longitude: Number("-75.5795") },
  { name: "Parque Lleras", latitude: Number("6.2181"), longitude: Number("-75.5665") },
];

export const PARKINGS: Parking[] = [
  { id: "centro", name: "Parqueadero Centro", availability: 91, price: 12000, distance: 450, walk: 5, x: 62, y: 38, latitude: Number("6.2442"), longitude: Number("-75.5812"), scheduleLabel: "Lun-Dom", openingTime: "06:00", closingTime: "22:00", contactPhone: "+57 300 123 4567", contactWhatsapp: "+573001234567", contactAddress: "Calle 50 # 45-12, Medellín" },
  { id: "norte", name: "Parqueadero Norte", availability: 76, price: 8000, distance: 900, walk: 8, x: 30, y: 22, latitude: Number("6.2711"), longitude: Number("-75.5611"), scheduleLabel: "Lun-Dom", openingTime: "05:30", closingTime: "21:30", contactPhone: "+57 301 234 5678", contactWhatsapp: "+573012345678", contactAddress: "Carrera 65 # 80-21, Medellín" },
  { id: "sur", name: "Parqueadero Sur", availability: 63, price: 10000, distance: 260, walk: 3, x: 48, y: 70, latitude: Number("6.191"), longitude: Number("-75.591"), scheduleLabel: "Lun-Dom", openingTime: "06:00", closingTime: "23:00", contactPhone: "+57 302 345 6789", contactWhatsapp: "+573023456789", contactAddress: "Avenida 80 # 32-10, Medellín" },
  { id: "laureles", name: "Parqueadero Laureles", availability: 88, price: 11000, distance: 520, walk: 6, x: 42, y: 26, latitude: Number("6.2485"), longitude: Number("-75.5952"), scheduleLabel: "Lun-Dom", openingTime: "06:00", closingTime: "23:00", contactPhone: "+57 304 222 3344", contactWhatsapp: "+573042223344", contactAddress: "Circular 73 # 39-22, Medellín" },
  { id: "poblado", name: "Parqueadero El Poblado", availability: 74, price: 13500, distance: 300, walk: 4, x: 74, y: 34, latitude: Number("6.2167"), longitude: Number("-75.5669"), scheduleLabel: "Lun-Dom", openingTime: "05:30", closingTime: "23:30", contactPhone: "+57 304 333 4455", contactWhatsapp: "+573043334455", contactAddress: "Carrera 43A # 7-40, Medellín" },
];

export const AI_SERIES = [
  { hour: "5 PM", value: 60 },
  { hour: "6 PM", value: 72 },
  { hour: "7 PM", value: 91 },
  { hour: "8 PM", value: 83 },
  { hour: "9 PM", value: 75 },
];
