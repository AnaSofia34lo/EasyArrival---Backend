import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetParkingUseCase } from '../../application/use-cases/get-parking.use-case';
import { ListParkingsUseCase } from '../../application/use-cases/list-parkings.use-case';

@Controller('parkings')
export class ParkingsController {
  constructor(
    private readonly listParkings: ListParkingsUseCase,
    private readonly getParking: GetParkingUseCase,
  ) {}

  @Get()
  findAll() {
    return this.listParkings.execute();
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
