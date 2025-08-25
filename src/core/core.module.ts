/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Global() // 1. Make the module global
@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule],
  exports: [ConfigModule, DatabaseModule, LoggerModule], // 2. Export the modules
})
export class CoreModule {}
