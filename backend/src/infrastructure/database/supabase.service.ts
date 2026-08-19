import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ??
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error(
        'Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY) en el .env',
      );
    }

    this.client = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
