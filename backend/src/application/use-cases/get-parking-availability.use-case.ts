import { Injectable } from '@nestjs/common';
import { ParkingAvailabilityRepository } from '../../domain/repositories/parking-availability.repository';
import { ParkingRepository } from '../../domain/repositories/parking.repository';
import { ParkingAiService } from '../../domain/services/parking-ai.service';

@Injectable()
export class GetParkingAvailabilityUseCase {
  constructor(
    private readonly parkingRepository: ParkingRepository,
    private readonly parkingAvailabilityRepository: ParkingAvailabilityRepository,
    private readonly parkingAiService: ParkingAiService,
  ) {}

  async execute(parkingId: string, destinationName?: string) {
    const parking = await this.parkingRepository.findById(parkingId);
    if (!parking) {
      return null;
    }

    const currentAvailability =
      await this.parkingAvailabilityRepository.findLatestByParkingId(parkingId);
    const history = await this.parkingAvailabilityRepository.findRecentHistoryByParkingId(
      parkingId,
      48,
    );

    const currentAvailabilityPercent =
      currentAvailability?.availabilityPercent ?? Math.max(0, parking.totalCapacity - 5);

    const aiEstimation = await this.parkingAiService.estimateAvailability({
      parking,
      destinationName,
      currentAvailabilityPercent,
      history,
    });

    return {
      parkingId: parking.id,
      parkingName: parking.name,
      currentAvailabilityPercent,
      estimatedAvailabilityPercent: aiEstimation.estimatedAvailabilityPercent,
      confidencePercent: aiEstimation.confidencePercent,
      explanation: aiEstimation.explanation,
      lastUpdatedAt: currentAvailability?.recordedAt ?? null,
    };
  }
}
