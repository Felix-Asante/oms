import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/schema';
import { DrizzleDB } from './types/drizzle';

export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const env = configService.get<string>('NODE_ENV');
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: env === 'prod',
        });
        return drizzle(pool, { schema }) as DrizzleDB;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
