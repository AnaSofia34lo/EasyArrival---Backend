import { Injectable } from '@nestjs/common';
import { Parking } from '../../domain/entities/parking.entity';
import { ParkingRepository } from '../../domain/repositories/parking.repository';
import { SupabaseService } from './supabase.service';

type ParkingRow = {
  id: string;
  name: string;
  price_per_hour: number;
  total_capacity: number;
  map_x: number;
  map_y: number;
  latitude: number | null;
  longitude: number | null;
};

@Injectable()
export class SupabaseParkingRepository extends ParkingRepository {
  constructor(private readonly supabase: SupabaseService) {
    super();
  }

  async findAll(): Promise<Parking[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('parkings')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Error al listar parqueaderos: ${error.message}`);
    }

    return (data ?? []).map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Parking | null> {
    const { data, error } = await this.supabase
      .getClient()
      .from('parkings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al buscar parqueadero: ${error.message}`);
    }

    return data ? this.toDomain(data) : null;
  }

  private toDomain(row: ParkingRow): Parking {
    return new Parking(
      row.id,
      row.name,
      row.price_per_hour,
      row.total_capacity,
      Number(row.map_x),
      Number(row.map_y),
      row.latitude === null ? null : Number(row.latitude),
      row.longitude === null ? null : Number(row.longitude),
    );
  }
}
