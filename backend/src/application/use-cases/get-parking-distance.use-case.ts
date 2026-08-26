import { Injectable } from '@nestjs/common';
import { ParkingRepository } from '../../domain/repositories/parking.repository';

@Injectable()
export class GetParkingDistanceUseCase {
  constructor(private readonly parkingRepository: ParkingRepository) {}

  execute(parkingId: string, destinationName: string) {
    return this.parkingRepository.findDistanceToDestination(
      parkingId,
      destinationName,
    );
  }
}
