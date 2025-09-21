/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProductsService } from 'src/modules/products/products.service';
import { ReviewRepository } from './repositories/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Create a review for a product.
   * - Checks if the product exists using ProductsService.
   * - Prevents duplicate reviews from the same user for the same product.
   */
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const product = await this.productsService.getProductById(
      createReviewDto.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingReview = await this.reviewRepository.findOneOrDefault({
      user: { id: createReviewDto.userId } as any,
      product: { id: createReviewDto.productId } as any,
    });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    return await this.reviewRepository.create({
      title: createReviewDto.title,
      comment: createReviewDto.comment,
      rating: createReviewDto.rating,
      user: { id: createReviewDto.userId } as any,
      product: { id: createReviewDto.productId } as any,
    });
  }

  /**
   * Update a review.
   * - Only allows the review owner to update.
   */
  async updateReview(
    reviewId: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne(
      { id: reviewId },
      { relations: ['user'] },
    );
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only update your own review');
    }
    return await this.reviewRepository.findOneAndUpdate(
      { id: reviewId },
      updateReviewDto,
    );
  }

  /**
   * Delete a review.
   * - Only allows the review owner to delete.
   */
  async deleteReview(
    reviewId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOne(
      { id: reviewId },
      { relations: ['user'] },
    );
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own review');
    }
    await this.reviewRepository.findOneAndDelete({ id: reviewId });
    return { message: 'Review deleted successfully' };
  }

  /**
   * Get all reviews for a product.
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    // Optionally check product existence using ProductsService
    await this.productsService.getProductById(productId);
    return await this.reviewRepository.findAll({
      where: { product: { id: productId } as any },
      relations: ['user'],
      order: { reviewDate: 'DESC' },
    });
  }

  /**
   * Get average rating for a product.
   */
  async getProductAverageRating(productId: string): Promise<number> {
    // Optionally check product existence using ProductsService
    await this.productsService.getProductById(productId);
    const reviews = await this.reviewRepository.findAll({
      where: { product: { id: productId } as any },
    });
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(2));
  }
}
