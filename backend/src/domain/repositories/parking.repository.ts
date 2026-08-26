import { Parking } from '../entities/parking.entity';
import { ParkingDistance } from '../entities/parking-distance.entity';

export abstract class ParkingRepository {
  abstract findAll(): Promise<Parking[]>;
  abstract findById(id: string): Promise<Parking | null>;
  abstract searchByName(query: string, limit?: number): Promise<Parking[]>;
  abstract findDistanceToDestination(
    parkingId: string,
    destinationName: string,
  ): Promise<ParkingDistance | null>;
  abstract findNearbyByDestination(
    destinationName: string,
    limit?: number,
  ): Promise<Array<{ parking: Parking; distance: ParkingDistance }>>;
}
