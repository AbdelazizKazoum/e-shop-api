/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard'; // Adjust path if needed

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    // Attach userId from JWT payload to DTO
    const userId = req.user['id'];
    console.log('🚀 ~ ReviewsController ~ create ~ userId:', userId);

    return this.reviewsService.createReview({
      ...createReviewDto,
      userId,
    });
  }

  @Get('product/:productId')
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getProductReviews(
      productId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
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
