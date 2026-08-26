import { Injectable } from '@nestjs/common';
import { ParkingAvailabilityRepository } from '../../domain/repositories/parking-availability.repository';
import { ParkingRepository } from '../../domain/repositories/parking.repository';
import { ParkingAiService } from '../../domain/services/parking-ai.service';

@Injectable()
export class ListNearbyParkingsUseCase {
  constructor(
    private readonly parkingRepository: ParkingRepository,
    private readonly parkingAvailabilityRepository: ParkingAvailabilityRepository,
    private readonly parkingAiService: ParkingAiService,
  ) {}

  async execute(destinationName: string, limit = 5) {
    const nearby = await this.parkingRepository.findNearbyByDestination(
      destinationName,
      limit,
    );

    const availabilityByParking =
      await this.parkingAvailabilityRepository.findLatestByParkingIds(
        nearby.map((item) => item.parking.id),
      );

    const results = await Promise.all(
      nearby.map(async ({ parking, distance }) => {
        const currentAvailability = availabilityByParking.get(parking.id);
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
          destinationName,
          currentAvailabilityPercent,
          history,
        });

        return {
          parkingId: parking.id,
          parkingName: parking.name,
          pricePerHour: parking.pricePerHour,
          distanceMeters: distance.distanceMeters,
          walkMinutes: distance.walkMinutes,
          currentAvailabilityPercent,
          estimatedAvailabilityPercent: aiEstimation.estimatedAvailabilityPercent,
          confidencePercent: aiEstimation.confidencePercent,
          explanation: aiEstimation.explanation,
          lastUpdatedAt: currentAvailability?.recordedAt ?? null,
        };
      }),
    );

    return results;
  }
}
