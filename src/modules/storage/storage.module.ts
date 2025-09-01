/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';

@Module({})
export class StorageModule {
  providers: [R2Service];
  exports: [R2Service];
}
