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
  ) {}
}
