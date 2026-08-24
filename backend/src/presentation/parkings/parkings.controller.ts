import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { GetParkingAvailabilityUseCase } from '../../application/use-cases/get-parking-availability.use-case';
import { GetParkingDistanceUseCase } from '../../application/use-cases/get-parking-distance.use-case';
import { GetParkingUseCase } from '../../application/use-cases/get-parking.use-case';
import { ListNearbyParkingsUseCase } from '../../application/use-cases/list-nearby-parkings.use-case';
import { ListParkingsUseCase } from '../../application/use-cases/list-parkings.use-case';
import { SearchParkingsWithAvailabilityUseCase } from '../../application/use-cases/search-parkings-with-availability.use-case';

@Controller('parkings')
export class ParkingsController {
  constructor(
    private readonly listParkings: ListParkingsUseCase,
    private readonly getParking: GetParkingUseCase,
    private readonly getParkingDistance: GetParkingDistanceUseCase,
    private readonly getParkingAvailability: GetParkingAvailabilityUseCase,
    private readonly listNearbyParkings: ListNearbyParkingsUseCase,
    private readonly searchParkingsWithAvailability: SearchParkingsWithAvailabilityUseCase,
  ) {}

  @Get()
  findAll() {
    return this.listParkings.execute();
  }

  @Get('nearby')
  async findNearby(
    @Query('destination') destination?: string,
    @Query('limit') limitParam?: string,
  ) {
    if (!destination?.trim()) {
      throw new BadRequestException(
        'Debes enviar destination con el nombre del destino',
      );
    }

    const parsedLimit = Number(limitParam ?? '5');
    const limit = Number.isNaN(parsedLimit)
      ? 5
      : Math.max(1, Math.min(parsedLimit, 20));

    return this.listNearbyParkings.execute(destination.trim(), limit);
  }

  @Get('availability/search')
  async searchAvailability(
    @Query('query') query?: string,
    @Query('limit') limitParam?: string,
  ) {
    if (!query?.trim()) {
      throw new BadRequestException('Debes enviar query para buscar parqueaderos');
    }

    const parsedLimit = Number(limitParam ?? '5');
    const limit = Number.isNaN(parsedLimit)
      ? 5
      : Math.max(1, Math.min(parsedLimit, 20));

    return this.searchParkingsWithAvailability.execute(query.trim(), limit);
  }

  @Get(':id/distance')
  async findDistance(
    @Param('id') id: string,
    @Query('destination') destination?: string,
  ) {
    if (!destination?.trim()) {
      throw new BadRequestException(
        'Debes enviar destination con el nombre del destino',
      );
    }

    const distance = await this.getParkingDistance.execute(id, destination.trim());

    if (!distance) {
      throw new NotFoundException(
        `No hay distancia registrada para parqueadero ${id} y destino ${destination}`,
      );
    }

    return distance;
  }

  @Get(':id/availability')
  async findAvailability(
    @Param('id') id: string,
    @Query('destination') destination?: string,
  ) {
    const availability = await this.getParkingAvailability.execute(
      id,
      destination?.trim(),
    );

    if (!availability) {
      throw new NotFoundException(`Parqueadero ${id} no encontrado`);
    }

    return availability;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const parking = await this.getParking.execute(id);
    if (!parking) {
      throw new NotFoundException(`Parqueadero ${id} no encontrado`);
    }
    return parking;
  }
}
