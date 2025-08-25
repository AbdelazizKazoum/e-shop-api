import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Variant } from './entities/variant.entity';
import { Stock } from './entities/stock.entity';
import { Review } from './entities/review.entity';
import { DatabaseModule } from 'src/core/database/database.module';
import { Image } from './entities/image.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Product,
      Category,
      Variant,
      Image,
      Stock,
      Review,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
