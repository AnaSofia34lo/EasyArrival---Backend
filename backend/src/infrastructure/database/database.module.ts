import { Global, Module } from '@nestjs/common';
import { DestinationRepository } from '../../domain/repositories/destination.repository';
import { ParkingAvailabilityRepository } from '../../domain/repositories/parking-availability.repository';
import { ParkingRepository } from '../../domain/repositories/parking.repository';
import { ParkingAiService } from '../../domain/services/parking-ai.service';
import { GetParkingAvailabilityUseCase } from '../../application/use-cases/get-parking-availability.use-case';
import { GetParkingDistanceUseCase } from '../../application/use-cases/get-parking-distance.use-case';
import { ListParkingsUseCase } from '../../application/use-cases/list-parkings.use-case';
import { ListNearbyParkingsUseCase } from '../../application/use-cases/list-nearby-parkings.use-case';
import { SearchParkingsWithAvailabilityUseCase } from '../../application/use-cases/search-parkings-with-availability.use-case';
import { GetParkingUseCase } from '../../application/use-cases/get-parking.use-case';
import { LlmParkingAiService } from '../ai/llm-parking-ai.service';
import { SupabaseService } from './supabase.service';
import { SupabaseParkingAvailabilityRepository } from './supabase-parking-availability.repository';
import { SupabaseParkingRepository } from './supabase-parking.repository';
import { SupabaseDestinationRepository } from './supabase-destination.repository';

@Global()
@Module({
  providers: [
    SupabaseService,
    {
      provide: ParkingRepository,
      useClass: SupabaseParkingRepository,
    },
    {
      provide: DestinationRepository,
      useClass: SupabaseDestinationRepository,
    },
    {
      provide: ParkingAvailabilityRepository,
      useClass: SupabaseParkingAvailabilityRepository,
    },
    {
      provide: ParkingAiService,
      useClass: LlmParkingAiService,
    },
    ListParkingsUseCase,
    GetParkingUseCase,
    GetParkingDistanceUseCase,
    GetParkingAvailabilityUseCase,
    ListNearbyParkingsUseCase,
    SearchParkingsWithAvailabilityUseCase,
  ],
  exports: [
    SupabaseService,
    ParkingRepository,
    DestinationRepository,
    ParkingAvailabilityRepository,
    ParkingAiService,
    ListParkingsUseCase,
    GetParkingUseCase,
    GetParkingDistanceUseCase,
    GetParkingAvailabilityUseCase,
    ListNearbyParkingsUseCase,
    SearchParkingsWithAvailabilityUseCase,
  ],
})
export class DatabaseModule {}
