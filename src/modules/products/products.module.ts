/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Variant } from './entities/variant.entity';
import { Review } from './entities/review.entity';
import { DatabaseModule } from 'src/core/database/database.module';
import { Image } from './entities/image.entity';
import { ProductRepository } from './repositories/product.repository';
import { CategoryRepository } from './repositories/category.repository';
import { StorageModule } from '../storage/storage.module';
import { R2Service } from '../storage/r2.service';
import { VariantRepository } from './repositories/variant.repository';
import { ImageRepository } from './repositories/image.repository';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Product, Category, Variant, Image, Review]),
    StorageModule,
    StockModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    VariantRepository,
    ImageRepository,
    CategoryRepository,
    R2Service,
  ],
})
export class ProductsModule {}
