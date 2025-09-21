/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { ProductsModule } from '../products/products.module';
import { ReviewRepository } from './repositories/review.repository';
import { Review } from './entities/review.entity';

@Module({
  imports: [DatabaseModule.forFeature([Review]), ProductsModule],
  controllers: [ReviewsController],
  providers: [ReviewRepository, ReviewsService],
})
export class ReviewsModule {}
