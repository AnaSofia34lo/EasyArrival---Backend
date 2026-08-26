import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetParkingAvailabilityUseCase } from '../../application/use-cases/get-parking-availability.use-case';
import { GetParkingDistanceUseCase } from '../../application/use-cases/get-parking-distance.use-case';
import { GetParkingUseCase } from '../../application/use-cases/get-parking.use-case';
import { ListNearbyParkingsUseCase } from '../../application/use-cases/list-nearby-parkings.use-case';
import { ListParkingsUseCase } from '../../application/use-cases/list-parkings.use-case';
import { SearchParkingsWithAvailabilityUseCase } from '../../application/use-cases/search-parkings-with-availability.use-case';

@Controller('parkings')
@ApiTags('parkings')
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
  @ApiOperation({ summary: 'Listar todos los parqueaderos' })
  @ApiResponse({ status: 200, description: 'Lista ordenada por nombre.' })
  findAll() {
    return this.listParkings.execute();
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Mostrar parqueaderos cercanos y su disponibilidad',
    description:
      'Busca un destino registrado y devuelve los parqueaderos más cercanos, distancia caminando, precio y disponibilidad actual/estimada por IA.',
  })
  @ApiQuery({
    name: 'destination',
    required: true,
    description:
      'Nombre exacto del destino registrado. Ejemplo: Universidad de Medellín.',
    example: 'Universidad de Medellín',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description:
      'Cantidad de resultados. Se limita entre 1 y 20. Valor predeterminado: 5.',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Parqueaderos cercanos con métricas de disponibilidad.',
  })
  @ApiResponse({ status: 400, description: 'Falta el destino.' })
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
  @ApiOperation({
    summary: 'Buscar un parqueadero y consultar su disponibilidad',
    description:
      'Permite buscar cualquier parqueadero por parte de su nombre y devuelve disponibilidad actual, estimación IA, confianza y explicación.',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description:
      'Texto parcial o completo del nombre del parqueadero. Ejemplo: centro.',
    example: 'centro',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Máximo 20 resultados. Valor predeterminado: 5.',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda con disponibilidad.',
  })
  @ApiResponse({ status: 400, description: 'Falta el texto de búsqueda.' })
  async searchAvailability(
    @Query('query') query?: string,
    @Query('limit') limitParam?: string,
  ) {
    if (!query?.trim()) {
      throw new BadRequestException(
        'Debes enviar query para buscar parqueaderos',
      );
    }

    const parsedLimit = Number(limitParam ?? '5');
    const limit = Number.isNaN(parsedLimit)
      ? 5
      : Math.max(1, Math.min(parsedLimit, 20));

    return this.searchParkingsWithAvailability.execute(query.trim(), limit);
  }

  @Get(':id/distance')
  @ApiOperation({
    summary: 'Mostrar distancia entre un parqueadero y un destino',
    description:
      'Devuelve distancia en metros y tiempo aproximado caminando usando la relación registrada en Supabase.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero. Ejemplo: centro.',
    example: 'centro',
  })
  @ApiQuery({
    name: 'destination',
    required: true,
    description: 'Nombre exacto del destino.',
    example: 'Universidad de Medellín',
  })
  @ApiResponse({
    status: 200,
    description: 'Distancia en metros y minutos caminando.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe una distancia registrada para esa combinación.',
  })
  async findDistance(
    @Param('id') id: string,
    @Query('destination') destination?: string,
  ) {
    if (!destination?.trim()) {
      throw new BadRequestException(
        'Debes enviar destination con el nombre del destino',
      );
    }

    const distance = await this.getParkingDistance.execute(
      id,
      destination.trim(),
    );

    if (!distance) {
      throw new NotFoundException(
        `No hay distancia registrada para parqueadero ${id} y destino ${destination}`,
      );
    }

    return distance;
  }

  @Get(':id/availability')
  @ApiOperation({
    summary: 'Mostrar disponibilidad de un parqueadero específico',
    description:
      'Consulta el último registro guardado y calcula una disponibilidad aproximada usando el histórico. Si hay API IA configurada, también puede usar Gemini o DeepSeek.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero. Ejemplo: centro.',
    example: 'centro',
  })
  @ApiQuery({
    name: 'destination',
    required: false,
    description: 'Destino opcional para dar contexto a la estimación IA.',
    example: 'Universidad de Medellín',
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad actual, estimada, confianza y explicación.',
  })
  @ApiResponse({ status: 404, description: 'Parqueadero no encontrado.' })
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
  @ApiOperation({ summary: 'Obtener un parqueadero por identificador' })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero. Ejemplo: centro.',
    example: 'centro',
  })
  @ApiResponse({ status: 200, description: 'Información del parqueadero.' })
  @ApiResponse({ status: 404, description: 'Parqueadero no encontrado.' })
  async findOne(@Param('id') id: string) {
    const parking = await this.getParking.execute(id);
    if (!parking) {
      throw new NotFoundException(`Parqueadero ${id} no encontrado`);
    }
    return parking;
  }
}
