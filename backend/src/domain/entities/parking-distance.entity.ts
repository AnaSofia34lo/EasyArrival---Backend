export class ParkingDistance {
  constructor(
    public readonly parkingId: string,
    public readonly destinationId: string,
    public readonly distanceMeters: number,
    public readonly walkMinutes: number,
  ) {}
}
