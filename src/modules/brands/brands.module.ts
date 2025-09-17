import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandRepository } from './repositories/brand.repository';
import { DatabaseModule } from 'src/core/database/database.module';
import { Brand } from './entities/brand.entity';
import { StorageModule } from '../storage/storage.module';
import { R2Service } from '../storage/r2.service';

@Module({
  imports: [DatabaseModule.forFeature([Brand]), StorageModule],
  controllers: [BrandsController],
  providers: [BrandsService, BrandRepository, R2Service],
  exports: [BrandsService],
})
export class BrandsModule {}
