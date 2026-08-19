import { Global, Module } from '@nestjs/common';
import { DestinationRepository } from '../../domain/repositories/destination.repository';
import { ParkingRepository } from '../../domain/repositories/parking.repository';
import { ListParkingsUseCase } from '../../application/use-cases/list-parkings.use-case';
import { GetParkingUseCase } from '../../application/use-cases/get-parking.use-case';
import { SupabaseService } from './supabase.service';
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
    ListParkingsUseCase,
    GetParkingUseCase,
  ],
  exports: [
    SupabaseService,
    ParkingRepository,
    DestinationRepository,
    ListParkingsUseCase,
    GetParkingUseCase,
  ],
})
export class DatabaseModule {}
