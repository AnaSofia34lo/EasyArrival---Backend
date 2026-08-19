import { Destination } from '../entities/destination.entity';

export abstract class DestinationRepository {
  abstract findAll(): Promise<Destination[]>;
  abstract findByName(name: string): Promise<Destination | null>;
}
