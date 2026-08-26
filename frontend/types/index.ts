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

export interface DestinationPoint {
  name: string;
  latitude: number;
  longitude: number;
}
