import { Injectable } from '@nestjs/common';
import { ParkingAvailabilityRepository } from '../../domain/repositories/parking-availability.repository';
import { ParkingRepository } from '../../domain/repositories/parking.repository';
import { ParkingAiService } from '../../domain/services/parking-ai.service';

@Injectable()
export class SearchParkingsWithAvailabilityUseCase {
  constructor(
    private readonly parkingRepository: ParkingRepository,
    private readonly parkingAvailabilityRepository: ParkingAvailabilityRepository,
    private readonly parkingAiService: ParkingAiService,
  ) {}

  async execute(query: string, limit = 5) {
    const parkings = await this.parkingRepository.searchByName(query, limit);

    return Promise.all(
      parkings.map(async (parking) => {
        const currentAvailability =
          await this.parkingAvailabilityRepository.findLatestByParkingId(parking.id);
        const history =
          await this.parkingAvailabilityRepository.findRecentHistoryByParkingId(
            parking.id,
            48,
          );

        const currentAvailabilityPercent =
          currentAvailability?.availabilityPercent ??
          Math.max(0, parking.totalCapacity - 5);

        const aiEstimation = await this.parkingAiService.estimateAvailability({
          parking,
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
      }),
    );
  }
}
