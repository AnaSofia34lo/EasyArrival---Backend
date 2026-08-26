export interface Parking {
  id: string;
  name: string;
  availability: number;
  price: number;
  distance: number;
  walk: number;
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  scheduleLabel: string;
  openingTime: string;
  closingTime: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
}

export interface NearbyParkingResponse {
  parkingId: string;
  parkingName: string;
  pricePerHour: number;
  distanceMeters: number;
  walkMinutes: number;
  currentAvailabilityPercent: number;
  estimatedAvailabilityPercent: number;
  confidencePercent: number;
  explanation: string;
  lastUpdatedAt: string | null;
}

export interface AvailabilityResponse {
  parkingId: string;
  parkingName: string;
  currentAvailabilityPercent: number;
  estimatedAvailabilityPercent: number;
  confidencePercent: number;
  explanation: string;
  lastUpdatedAt: string | null;
}

export interface DestinationPoint {
  name: string;
  latitude: number;
  longitude: number;
}
