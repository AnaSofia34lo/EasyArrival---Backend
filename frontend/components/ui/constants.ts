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

export interface Parking {
  id: string;
  name: string;
  availability: number;
  price: number;
  distance: number;
  walk: number;
  x: number;
  y: number;
}

export const PARKINGS: Parking[] = [
  { id: "centro", name: "Parqueadero Centro", availability: 91, price: 12000, distance: 450, walk: 5, x: 62, y: 38 },
  { id: "norte", name: "Parqueadero Norte", availability: 76, price: 8000, distance: 900, walk: 8, x: 30, y: 22 },
  { id: "sur", name: "Parqueadero Sur", availability: 63, price: 10000, distance: 260, walk: 3, x: 48, y: 70 },
];

export const AI_SERIES = [
  { hour: "5 PM", value: 60 },
  { hour: "6 PM", value: 72 },
  { hour: "7 PM", value: 91 },
  { hour: "8 PM", value: 83 },
  { hour: "9 PM", value: 75 },
];

export function statusColor(a: number) {
  if (a >= 75) return { c: COLORS.green, bg: COLORS.greenSoft, label: "Alta disponibilidad" };
  if (a >= 50) return { c: COLORS.orange, bg: COLORS.orangeSoft, label: "Disponibilidad media" };
  return { c: COLORS.red, bg: COLORS.redSoft, label: "Baja disponibilidad" };
}

export function money(n: number) {
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
