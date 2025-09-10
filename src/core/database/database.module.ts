/* eslint-disable prettier/prettier */
// src/database/database.module.ts

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import * as Joi from 'joi';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot(Joi.object({}))],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
