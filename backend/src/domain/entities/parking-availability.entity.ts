export class ParkingAvailabilitySnapshot {
  constructor(
    public readonly parkingId: string,
    public readonly availabilityPercent: number,
    public readonly recordedAt: Date,
  ) {}
}
