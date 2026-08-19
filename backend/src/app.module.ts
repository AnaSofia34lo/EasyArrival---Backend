import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HealthController } from './presentation/health/health.controller';
import { ParkingsController } from './presentation/parkings/parkings.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [HealthController, ParkingsController],
})
export class AppModule {}
