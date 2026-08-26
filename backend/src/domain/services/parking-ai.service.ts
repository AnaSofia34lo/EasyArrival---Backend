import { Parking } from '../entities/parking.entity';
import { ParkingAvailabilitySnapshot } from '../entities/parking-availability.entity';

export type AvailabilityEstimationInput = {
  parking: Parking;
  destinationName?: string;
  currentAvailabilityPercent: number;
  history: ParkingAvailabilitySnapshot[];
};

export type AvailabilityEstimation = {
  estimatedAvailabilityPercent: number;
  confidencePercent: number;
  explanation: string;
};

export abstract class ParkingAiService {
  abstract estimateAvailability(
    input: AvailabilityEstimationInput,
  ): Promise<AvailabilityEstimation>;
}
