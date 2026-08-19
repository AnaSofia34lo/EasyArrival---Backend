import { Injectable } from '@nestjs/common';
import { Parking } from '../../domain/entities/parking.entity';
import { ParkingRepository } from '../../domain/repositories/parking.repository';

@Injectable()
export class ListParkingsUseCase {
  constructor(private readonly parkingRepository: ParkingRepository) {}

  execute(): Promise<Parking[]> {
    return this.parkingRepository.findAll();
  }
}
