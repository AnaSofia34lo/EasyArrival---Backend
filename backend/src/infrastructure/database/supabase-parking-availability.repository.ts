import { Injectable } from '@nestjs/common';
import { ParkingAvailabilitySnapshot } from '../../domain/entities/parking-availability.entity';
import { ParkingAvailabilityRepository } from '../../domain/repositories/parking-availability.repository';
import { SupabaseService } from './supabase.service';

type ParkingAvailabilityRow = {
  parking_id: string;
  availability_percent: number;
  recorded_at: string;
};

@Injectable()
export class SupabaseParkingAvailabilityRepository extends ParkingAvailabilityRepository {
  constructor(private readonly supabase: SupabaseService) {
    super();
  }

  async findLatestByParkingId(
    parkingId: string,
  ): Promise<ParkingAvailabilitySnapshot | null> {
    const { data, error } = await this.supabase
      .getClient()
      .from('parking_availability')
      .select('parking_id,availability_percent,recorded_at')
      .eq('parking_id', parkingId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al consultar disponibilidad actual: ${error.message}`);
    }

    return data ? this.toDomain(data) : null;
  }

  async findLatestByParkingIds(
    parkingIds: string[],
  ): Promise<Map<string, ParkingAvailabilitySnapshot>> {
    if (parkingIds.length === 0) {
      return new Map<string, ParkingAvailabilitySnapshot>();
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('parking_availability')
      .select('parking_id,availability_percent,recorded_at')
      .in('parking_id', parkingIds)
      .order('recorded_at', { ascending: false });

    if (error) {
      throw new Error(`Error al consultar disponibilidad actual: ${error.message}`);
    }

    const latestByParking = new Map<string, ParkingAvailabilitySnapshot>();
    for (const row of (data ?? []) as ParkingAvailabilityRow[]) {
      if (!latestByParking.has(row.parking_id)) {
        latestByParking.set(row.parking_id, this.toDomain(row));
      }
    }

    return latestByParking;
  }

  async findRecentHistoryByParkingId(
    parkingId: string,
    limit = 48,
  ): Promise<ParkingAvailabilitySnapshot[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('parking_availability')
      .select('parking_id,availability_percent,recorded_at')
      .eq('parking_id', parkingId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error al consultar histórico de disponibilidad: ${error.message}`);
    }

    return ((data ?? []) as ParkingAvailabilityRow[]).map((row) =>
      this.toDomain(row),
    );
  }

  private toDomain(row: ParkingAvailabilityRow): ParkingAvailabilitySnapshot {
    return new ParkingAvailabilitySnapshot(
      row.parking_id,
      Number(row.availability_percent),
      new Date(row.recorded_at),
    );
  }
}
