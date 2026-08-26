import { ParkingAvailabilitySnapshot } from '../entities/parking-availability.entity';

export abstract class ParkingAvailabilityRepository {
  abstract findLatestByParkingId(
    parkingId: string,
  ): Promise<ParkingAvailabilitySnapshot | null>;

  abstract findLatestByParkingIds(
    parkingIds: string[],
  ): Promise<Map<string, ParkingAvailabilitySnapshot>>;

  abstract findRecentHistoryByParkingId(
    parkingId: string,
    limit?: number,
  ): Promise<ParkingAvailabilitySnapshot[]>;
}
