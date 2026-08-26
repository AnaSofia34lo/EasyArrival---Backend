export class Parking {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly pricePerHour: number,
    public readonly totalCapacity: number,
    public readonly mapX: number,
    public readonly mapY: number,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
    public readonly scheduleLabel: string,
    public readonly openingTime: string | null,
    public readonly closingTime: string | null,
    public readonly contactPhone: string | null,
    public readonly contactWhatsapp: string | null,
    public readonly contactAddress: string | null,
  ) {}
}
