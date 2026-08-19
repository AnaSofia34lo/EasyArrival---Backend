import { Injectable } from '@nestjs/common';
import { Destination } from '../../domain/entities/destination.entity';
import { DestinationRepository } from '../../domain/repositories/destination.repository';
import { SupabaseService } from './supabase.service';

type DestinationRow = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
};

@Injectable()
export class SupabaseDestinationRepository extends DestinationRepository {
  constructor(private readonly supabase: SupabaseService) {
    super();
  }

  async findAll(): Promise<Destination[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('destinations')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Error al listar destinos: ${error.message}`);
    }

    return (data ?? []).map((row) => this.toDomain(row));
  }

  async findByName(name: string): Promise<Destination | null> {
    const { data, error } = await this.supabase
      .getClient()
      .from('destinations')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al buscar destino: ${error.message}`);
    }

    return data ? this.toDomain(data) : null;
  }

  private toDomain(row: DestinationRow): Destination {
    return new Destination(
      row.id,
      row.name,
      row.latitude === null ? null : Number(row.latitude),
      row.longitude === null ? null : Number(row.longitude),
    );
  }
}
