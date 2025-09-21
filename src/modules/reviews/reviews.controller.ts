/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get('product/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Get('product/:productId/average-rating')
  getProductAverageRating(@Param('productId') productId: string) {
    return this.reviewsService.getProductAverageRating(productId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, userId, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body('userId') userId: string) {
    return this.reviewsService.deleteReview(id, userId);
  }
}
