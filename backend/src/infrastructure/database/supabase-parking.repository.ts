import { Injectable } from '@nestjs/common';
import { ParkingDistance } from '../../domain/entities/parking-distance.entity';
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

type ParkingDestinationRow = {
  parking_id: string;
  destination_id: string;
  distance_meters: number;
  walk_minutes: number;
  parkings: ParkingRow[] | null;
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

  async searchByName(query: string, limit = 5): Promise<Parking[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('parkings')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(limit);

    if (error) {
      throw new Error(`Error al buscar parqueaderos por nombre: ${error.message}`);
    }

    return (data ?? []).map((row) => this.toDomain(row));
  }

  async findDistanceToDestination(
    parkingId: string,
    destinationName: string,
  ): Promise<ParkingDistance | null> {
    const { data: destination, error: destinationError } = await this.supabase
      .getClient()
      .from('destinations')
      .select('id')
      .eq('name', destinationName)
      .maybeSingle();

    if (destinationError) {
      throw new Error(`Error al buscar destino: ${destinationError.message}`);
    }

    if (!destination) {
      return null;
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('parking_destinations')
      .select('*')
      .eq('parking_id', parkingId)
      .eq('destination_id', destination.id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al buscar distancia a destino: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return new ParkingDistance(
      data.parking_id,
      data.destination_id,
      Number(data.distance_meters),
      Number(data.walk_minutes),
    );
  }

  async findNearbyByDestination(
    destinationName: string,
    limit = 5,
  ): Promise<Array<{ parking: Parking; distance: ParkingDistance }>> {
    const { data: destination, error: destinationError } = await this.supabase
      .getClient()
      .from('destinations')
      .select('id')
      .eq('name', destinationName)
      .maybeSingle();

    if (destinationError) {
      throw new Error(`Error al buscar destino: ${destinationError.message}`);
    }

    if (!destination) {
      return [];
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('parking_destinations')
      .select(
        'parking_id,destination_id,distance_meters,walk_minutes,parkings(*)',
      )
      .eq('destination_id', destination.id)
      .order('distance_meters', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Error al listar parqueaderos cercanos: ${error.message}`);
    }

    return (data as ParkingDestinationRow[] | null)
      ?.filter((row) => Array.isArray(row.parkings) && row.parkings.length > 0)
      .map((row) => ({
        parking: this.toDomain((row.parkings as ParkingRow[])[0]),
        distance: new ParkingDistance(
          row.parking_id,
          row.destination_id,
          Number(row.distance_meters),
          Number(row.walk_minutes),
        ),
      })) ?? [];
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
