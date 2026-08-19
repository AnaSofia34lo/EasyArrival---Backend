import { Injectable } from '@nestjs/common';
import { Parking } from '../../domain/entities/parking.entity';
import { ParkingRepository } from '../../domain/repositories/parking.repository';

@Injectable()
export class GetParkingUseCase {
  constructor(private readonly parkingRepository: ParkingRepository) {}

  execute(id: string): Promise<Parking | null> {
    return this.parkingRepository.findById(id);
  }
}
