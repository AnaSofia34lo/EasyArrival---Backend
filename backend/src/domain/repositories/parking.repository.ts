import { Parking } from '../entities/parking.entity';

export abstract class ParkingRepository {
  abstract findAll(): Promise<Parking[]>;
  abstract findById(id: string): Promise<Parking | null>;
}
